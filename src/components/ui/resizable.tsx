import * as ResizablePrimitive from 'react-resizable-panels'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui Resizable (react-resizable-panels v4).
 * 시안 실측 폭을 **픽셀 기본값**으로 두고(defaultSize={212}), 사용자가 경계를 끌어 조절한다.
 * 경계선은 시안의 1px divider 그대로 두고, hover·drag에서만 브랜드색으로 강조한다.
 */

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Group>) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn('flex min-h-0 w-full flex-1', className)}
      {...props}
    />
  )
}

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return (
    <ResizablePrimitive.Panel data-slot="resizable-panel" className={cn('flex min-h-0 flex-col', className)} {...props} />
  )
}

function ResizableHandle({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Separator>) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        'relative w-px flex-none bg-ink-200 outline-none transition-colors',
        // 히트 영역만 넓히고 시각적으로는 1px 라인 유지 (시안 divider 기준 레이아웃)
        'after:absolute after:inset-y-0 after:left-1/2 after:w-[7px] after:-translate-x-1/2 after:content-[""]',
        'hover:bg-brand data-[dragging]:bg-brand cursor-col-resize',
        className,
      )}
      {...props}
    />
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
