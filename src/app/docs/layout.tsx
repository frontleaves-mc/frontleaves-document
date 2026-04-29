import { DocsLayout } from '@/components/layout/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';
import { getSection } from '@/lib/navigation';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.getPageTree()}
      githubUrl='https://github.com/bamboo-services/bamboo-base-go'
      sidebar={{
        enabled: true,
        collapsible: true,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--custom-${getSection(meta.path)}-selected-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
