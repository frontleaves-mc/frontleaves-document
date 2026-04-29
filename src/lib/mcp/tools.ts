import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getLLMText, source } from '@/lib/source';

export function registerTools(server: McpServer): void {
  // sector - 获取所有可用的文档板块列表
  server.registerTool(
    'sector',
    {
      description: '获取所有可用的文档板块列表',
      outputSchema: z.object({
        sectors: z
          .array(z.string())
          .describe('可用板块标识列表'),
      }),
    },
    async () => {
      const pages = source.getPages();
      const sectorSet = new Set<string>();
      for (const page of pages) {
        const segments = page.url.split('/');
        if (segments.length >= 3) {
          sectorSet.add(segments[2]);
        }
      }
      const sectors = Array.from(sectorSet);
      const lines = ['板块列表\n'];
      sectors.forEach((s, i) => {
        lines.push(`${i + 1}. ${s}`);
      });
      return {
        content: [{ type: 'text' as const, text: lines.join('\n') }],
        structuredContent: { sectors },
      };
    },
  );

  // list - 查看文档目录列表，可根据板块和关键词筛选
  server.registerTool(
    'list',
    {
      description: '查看文档目录列表，可根据板块和关键词筛选',
      inputSchema: {
        sector: z.string().describe('板块内容'),
        search: z.string().optional().describe('搜索关键词'),
      },
      outputSchema: z.object({
        sector: z.string().describe('查询的板块标识'),
        baseUrl: z.string().describe('文档基础地址'),
        documents: z
          .array(
            z.object({
              path: z.string().describe('文档路径'),
              title: z.string().describe('文档标题'),
              description: z.string().describe('文档描述'),
            }),
          )
          .describe('文档列表'),
      }),
    },
    async ({ sector, search }) => {
      const pages = source.getPages();
      const prefix = `/docs/${sector}`;
      const lines: string[] = [];
      const docs: Array<{ path: string; title: string; description: string }> =
        [];
      let num = 1;

      for (const page of pages) {
        if (!page.url.startsWith(prefix)) continue;

        const title = page.data.title ?? '';
        const description = page.data.description ?? '';

        if (search) {
          const q = search.toLowerCase();
          if (
            !title.toLowerCase().includes(q) &&
            !description.toLowerCase().includes(q)
          )
            continue;
        }

        const shortPath = page.url.slice(prefix.length) || '/';
        lines.push(`${num}. [${title}](${shortPath}): ${description}`);
        docs.push({ path: shortPath, title, description });
        num++;
      }

      return {
        content: [
          { type: 'text' as const, text: '基础地址: https://doc.x-lf.com' },
          {
            type: 'text' as const,
            text:
              lines.length > 0
                ? `文档列表\n\n${lines.join('\n')}`
                : '未找到匹配的文档',
          },
        ],
        structuredContent: {
          sector,
          baseUrl: 'https://doc.x-lf.com',
          documents: docs,
        },
      };
    },
  );

  // detail - 获取指定文档的完整 Markdown 内容
  server.registerTool(
    'detail',
    {
      description: '获取指定文档的完整 Markdown 内容',
      inputSchema: {
        sector: z.string().describe('板块标识，如 bamboo-base-go'),
        path: z.string().describe('文档路径，如 /architecture'),
      },
      outputSchema: z.object({
        sector: z.string().describe('板块标识'),
        path: z.string().describe('文档路径'),
        title: z.string().describe('文档标题'),
        url: z.string().describe('文档完整 URL'),
        content: z.string().describe('Markdown 文档内容'),
      }),
    },
    async ({ sector, path }) => {
      let normalizedPath = path;
      const sectorPrefix = `/docs/${sector}`;
      if (normalizedPath.startsWith(sectorPrefix)) {
        normalizedPath = normalizedPath.slice(sectorPrefix.length);
      }
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
      }

      const slugs = [sector, ...normalizedPath.split('/').filter(Boolean)];
      const page = source.getPage(slugs);

      if (!page) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `文档不存在: ${sector}${normalizedPath}`,
            },
          ],
          isError: true,
        };
      }

      const content = await getLLMText(page);
      return {
        content: [
          { type: 'text' as const, text: `板块: ${sector}` },
          { type: 'text' as const, text: `路径: ${path}` },
          { type: 'text' as const, text: `标题: ${page.data.title ?? ''}` },
          {
            type: 'text' as const,
            text: `文档地址: https://doc.x-lf.com${page.url}`,
          },
          { type: 'text' as const, text: content },
        ],
        structuredContent: {
          sector,
          path: normalizedPath,
          title: page.data.title ?? '',
          url: `https://doc.x-lf.com${page.url}`,
          content,
        },
      };
    },
  );

  // search - 在文档内容中搜索关键词，返回匹配行及上下文段落
  server.registerTool(
    'search',
    {
      description: '在文档内容中搜索关键词，返回匹配行及上下文段落',
      inputSchema: {
        query: z.string().describe('搜索关键词'),
        sector: z.string().optional().describe('板块标识筛选'),
        path: z.string().optional().describe('路径筛选'),
      },
      outputSchema: z.object({
        query: z.string().describe('搜索关键词'),
        sector: z.string().optional().describe('板块筛选'),
        path: z.string().optional().describe('路径筛选'),
        totalResults: z.number().describe('匹配总数'),
        results: z.array(
          z.object({
            title: z.string(),
            sector: z.string(),
            detailPath: z.string(),
            excerpt: z.string(),
          }),
        ),
      }),
    },
    async ({ query, sector, path }) => {
      const pages = source.getPages();
      const lowerQuery = query.toLowerCase();
      const results: Array<{
        title: string;
        pageSector: string;
        detailPath: string;
        excerpt: string;
      }> = [];

      for (const page of pages) {
        const url = page.url;

        if (sector) {
          if (!url.includes(`/${sector}/`) && !url.endsWith(`/${sector}`))
            continue;
        }

        if (path) {
          const normalizedFilter = path.startsWith('/') ? path : `/${path}`;
          if (!url.includes(normalizedFilter)) continue;
        }

        const text = await page.data.getText('processed');
        const lowerText = text.toLowerCase();
        const idx = lowerText.indexOf(lowerQuery);

        if (idx !== -1) {
          const urlParts = url.split('/');
          const pageSector = urlParts[2] ?? '';
          const detailPathParts = urlParts.slice(3).join('/');
          const detailPath = detailPathParts ? `/${detailPathParts}` : '/';

          const start = Math.max(0, idx - 100);
          const end = Math.min(text.length, idx + query.length + 100);
          const excerpt = text.slice(start, end);

          results.push({
            title: page.data.title ?? '',
            pageSector,
            detailPath,
            excerpt,
          });
        }
      }

      const contents: Array<{ type: 'text'; text: string }> = [
        { type: 'text' as const, text: `关键词: ${query}` },
      ];
      if (sector)
        contents.push({ type: 'text' as const, text: `板块筛选: ${sector}` });
      if (path)
        contents.push({ type: 'text' as const, text: `路径筛选: ${path}` });

      if (results.length === 0) {
        contents.push({ type: 'text' as const, text: '未找到匹配内容' });
      } else {
        contents.push({
          type: 'text' as const,
          text: `共找到 ${results.length} 个匹配`,
        });
        for (let i = 0; i < results.length; i++) {
          const r = results[i];
          contents.push({
            type: 'text' as const,
            text: `${i + 1}. [${r.pageSector}](${r.detailPath})`,
          });
          contents.push({
            type: 'text' as const,
            text: `  ⎿ ${r.excerpt}`,
          });
        }
      }

      return {
        content: contents,
        structuredContent: {
          query,
          ...(sector ? { sector } : {}),
          ...(path ? { path } : {}),
          totalResults: results.length,
          results: results.map((r) => ({
            title: r.title,
            sector: r.pageSector,
            detailPath: r.detailPath,
            excerpt: r.excerpt,
          })),
        },
      };
    },
  );
}
