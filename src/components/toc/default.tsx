'use client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { cn } from '../../lib/cn';
import { type ComponentProps, useRef } from 'react';
import { mergeRefs } from '../../lib/merge-refs';
import { TocThumb, useTOCItems } from './index';
import * as Primitive from 'fumadocs-core/toc';
import { usePathname } from 'next/navigation';
import { getSection } from '../../lib/navigation';

export function TOCItems({ ref, className, ...props }: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const { text } = useI18n();
  const pathname = usePathname();
  const section = getSection(pathname);
  const sectionColor = `var(--custom-${section}-selected-color, var(--color-fd-foreground))`;

  if (items.length === 0)
    return (
      <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
        {text.tocNoHeadings}
      </div>
    );

  return (
    <div
      style={{
        '--section-color': sectionColor,
      } as React.CSSProperties}
    >
      <TocThumb
        containerRef={containerRef}
        className="absolute top-(--fd-top) h-(--fd-height) w-0.5 rounded-e-sm bg-(--section-color) transition-[top,height] ease-linear"
      />
      <div
        ref={mergeRefs(ref, containerRef)}
        className={cn('flex flex-col border-s border-fd-foreground/10', className)}
        {...props}
      >
        {items.map((item) => (
          <TOCItem key={item.url} item={item} />
        ))}
      </div>
    </div>
  );
}

function TOCItem({ item }: { item: Primitive.TOCItemType }) {
  return (
    <Primitive.TOCItem
      href={item.url}
      className={cn(
        'prose py-1.5 text-sm text-fd-muted-foreground transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-(--section-color)',
        item.depth <= 2 && 'ps-3',
        item.depth === 3 && 'ps-6',
        item.depth >= 4 && 'ps-8',
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
