import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { registerTools } from '@/lib/mcp/tools';

export const runtime = 'nodejs';

// ── CORS 跨域头 ──────────────────────────────────────────────────────────────
// SDK 未为 Streamable HTTP 传输层提供内置的 CORS 支持。
// 此处手动配置以支持 Claude Code 等跨源客户端。

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-Id',
  'Access-Control-Expose-Headers':
    'WWW-Authenticate, Mcp-Session-Id, Last-Event-Id, Mcp-Protocol-Version',
};

// ── 服务端工厂 ─────────────────────────────────────────────────────────────────

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'BambooDocument',
    version: '0.1.0',
  });
  registerTools(server);
  return server;
}

// ── 响应辅助函数 ────────────────────────────────────────────────────────────────

/**
 * 为 SDK 响应包裹 CORS 头部。
 *
 * 先完整读取响应体文本，避免 Next.js 16 中流式传输问题：
 * 直接使用 `new Response(response.body, ...)` 转移流时，
 * Next.js 内部的响应克隆/处理流程可能导致 body 丢失。
 */
async function withCors(response: Response): Promise<Response> {
  const text = await response.text();
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * MCP SDK 要求客户端的 Accept 头必须同时包含
 * "application/json" 和 "text/event-stream"。
 * 部分客户端（如 Claude Code）可能未发送此组合，
 * 在转发给 SDK 前自动补全该头部。
 */
const REQUIRED_ACCEPT = 'application/json, text/event-stream';

function ensureAcceptHeader(request: Request): Request {
  const accept = request.headers.get('accept') ?? '';
  if (
    accept.includes('application/json') &&
    accept.includes('text/event-stream')
  ) {
    return request;
  }
  const headers = new Headers(request.headers);
  headers.set('Accept', REQUIRED_ACCEPT);
  return new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-expect-error Next.js 扩展了 Request；流式 body 需要 duplex 声明
    duplex: 'half',
  });
}

// ── 统一请求处理器（无状态模式） ─────────────────────────────────────────────
//
// 遵循官方 SDK 示例 examples/server/honoWebStandardStreamableHttp.js 的模式：
//   - 每次请求创建全新的 McpServer + Transport（无状态）
//   - 由 SDK 内部完成 JSON-RPC 解析、校验、错误响应
//   - 无需自定义会话管理逻辑
//

async function handleMcpRequest(request: Request): Promise<Response> {
  try {
    // 无状态模式：每次请求创建新的服务端实例和传输层。
    // SDK 内部负责解析请求体、校验 JSON-RPC 格式、
    // 处理 initialize 请求、返回标准错误响应。
    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      enableJsonResponse: true,
    });
    await server.connect(transport);
    const response = await transport.handleRequest(ensureAcceptHeader(request));
    return await withCors(response);
  } catch (error) {
    console.error('[MCP] 请求处理异常:', error);
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal Server Error' },
        id: null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      },
    );
  }
}

// ── 路由处理器导出 ────────────────────────────────────────────────────────────

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export const POST = handleMcpRequest;
export const GET = handleMcpRequest;
export const DELETE = handleMcpRequest;
