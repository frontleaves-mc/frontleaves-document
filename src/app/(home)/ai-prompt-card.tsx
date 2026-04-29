'use client';

import { Bot, Check, Copy, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const AGENT_PROMPT = `请按以下步骤获取竹简文档并回答我的问题：

1. 获取文档索引：https://doc.x-lf.com/llms.txt
2. 从索引中找到与我的问题相关的页面路径
3. 获取该页面内容：https://doc.x-lf.com/llms.mdx/<找到的路径>
4. 基于文档内容回答：[你的问题]`;

export function AIPromptCard() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(AGENT_PROMPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-12 p-6 border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-3">
                <Bot className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">AI 友好</h2>
            </div>
            <p className="text-muted-foreground mb-4">
                本站支持 LLM 标准协议，复制下方 Prompt 到任意 AI Agent 即可直接读取文档内容。
            </p>
            <div className="relative group mb-4">
                <pre className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-all font-mono text-foreground/80 pr-12">
                    {AGENT_PROMPT}
                </pre>
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    title="复制 Prompt"
                >
                    {copied ? (
                        <Check className="size-4 text-green-500" />
                    ) : (
                        <Copy className="size-4" />
                    )}
                </button>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/docs/guide/claude-code"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                    <Terminal className="size-4" />
                    Claude Code 集成
                </Link>
                <Link
                    href="/docs/guide/ai-integration"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
                >
                    查看更多集成方式
                </Link>
            </div>
        </div>
    );
}
