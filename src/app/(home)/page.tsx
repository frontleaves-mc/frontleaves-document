import { ArrowRight, Download, Gamepad2, BookOpen, Lock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-bold mb-3">锋楪游戏 · 文档</h1>
        <p className="text-lg text-muted-foreground">
          锋楪 Minecraft 服务器文档中心，帮助你快速上手游戏
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">快速开始</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/docs/yggdrasil"
            className="group flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Download className="size-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                客户端安装
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                下载并配置游戏客户端
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/docs/game"
            className="group flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Gamepad2 className="size-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                游戏内容
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                服务器玩法与内容介绍
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/docs/guide"
            className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl opacity-50 cursor-not-allowed pointer-events-none"
          >
            <div className="flex items-center justify-center size-12 rounded-full bg-muted text-muted-foreground">
              <BookOpen className="size-6" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">教程</h3>
              <p className="text-sm text-muted-foreground mt-1">
                新手教程与进阶攻略
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
              <Lock className="size-3" />
              敬请期待
            </span>
          </Link>
        </div>
      </div>

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
              筱锋
            </a>{' '}
            维护
          </p>
          <Link
            href="/docs/guide"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            查看文档
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
