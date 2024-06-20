'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

type TooltipProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    Pick<
      ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
      'open' | 'defaultOpen' | 'onOpenChange'
    >,
  'content'
> & { content: ReactNode }

const Tooltip = ({
  children,
  content,
  sideOffset = 4,
  className,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) => (
  <TooltipPrimitive.Provider delayDuration={200}>
    <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={clsx(
          'z-50 overflow-hidden rounded-md border bg-dark-tremor-background-subtle px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {content}
        <TooltipPrimitive.Arrow width={11} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)

export { Tooltip }
