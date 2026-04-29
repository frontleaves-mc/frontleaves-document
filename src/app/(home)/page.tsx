import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AIPromptCard } from './ai-prompt-card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">竹简文档</h1>
        <p className="text-lg text-muted-foreground">
          Bamboo 服务组件库文档中心
        </p>
      </div>

      {/* Libraries */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">选择你的技术栈</h2>
        <div className="space-y-3">
          <Link
            href="/docs/bamboo-base-go/quick-start"
            className="group flex items-center justify-between p-5 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                筱工具 (Golang)
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Go 语言基础组件库，基于 Gin 框架构建可靠的后端服务
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/docs/bamboo-base-java/quick-start"
            className="group flex items-center justify-between p-5 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                筱工具 (Java)
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Java 语言基础组件库，基于 Spring Boot 3 构建企业级应用
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <div className="flex items-center justify-between p-5 border border-border rounded-xl opacity-50">
            <div>
              <h3 className="font-semibold text-lg">bamboo-base-ts</h3>
              <p className="text-sm text-muted-foreground mt-1">TypeScript 组件库</p>
            </div>
            <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">规划中</span>
          </div>
        </div>
      </div>

      {/* AI Integration */}
      <AIPromptCard />

      {/* Footer CTA */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            由{' '}
            <a
              href="https://www.x-lf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              筱锋xiao_lfeng
            </a>{' '}
            维护
          </p>
          <Link
            href="/docs/guide"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            开始阅读文档
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
