import React from 'react'
import { Color, colorPalette, getColorClassNames, tremorTwMerge } from '~/lib/tremor'
import { CustomTooltipProps } from '@tremor/react'
import { GroupByPeriod } from '~/services/vacancies/vacancies.types'
import { endOfMonth, endOfWeek, endOfYear, isSameDay, setDefaultOptions } from 'date-fns'
setDefaultOptions({ weekStartsOn: 1 })

export const ChartTooltipFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className={tremorTwMerge(
      // common
      'rounded-tremor-default text-tremor-default border',
      // light
      'bg-tremor-background shadow-tremor-dropdown border-tremor-border',
      // dark
      'dark:bg-dark-tremor-background dark:shadow-dark-tremor-dropdown dark:border-dark-tremor-border'
    )}
  >
    {children}
  </div>
)

export interface ChartTooltipRowProps {
  value: string
  name: string
  color: Color | string
}

export const ChartTooltipRow = ({ value, name, color }: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className={tremorTwMerge(
          // common
          'shrink-0 rounded-tremor-full border-2 h-3 w-3',
          // light
          'border-tremor-background shadow-tremor-card',
          // dark
          'dark:border-dark-tremor-background dark:shadow-dark-tremor-card',
          getColorClassNames(color, colorPalette.background).bgColor
        )}
      />
      <p
        className={tremorTwMerge(
          // commmon
          'text-right whitespace-nowrap',
          // light
          'text-tremor-content',
          // dark
          'dark:text-dark-tremor-content'
        )}
      >
        {name}
      </p>
    </div>
    <p
      className={tremorTwMerge(
        // common
        'font-medium tabular-nums text-right whitespace-nowrap',
        // light
        'text-tremor-content-emphasis',
        // dark
        'dark:text-dark-tremor-content-emphasis'
      )}
    >
      {value}
    </p>
  </div>
)

const ChartTooltip = ({
  active,
  payload,
  groupBy,
}: CustomTooltipProps & {
  rawDate: string
  groupBy: GroupByPeriod
}) => {
  if (active && payload) {
    const rawDate = payload[0]?.payload?.rawDate
    const filteredPayload = payload.filter((item: any) => item.type !== 'none')

    return (
      <ChartTooltipFrame>
        <div
          className={tremorTwMerge(
            // light
            'border-tremor-border border-b px-4 py-2',
            // dark
            'dark:border-dark-tremor-border'
          )}
        >
          <p
            className={tremorTwMerge(
              // common
              'font-medium',
              // light
              'text-tremor-content-emphasis',
              // dark
              'dark:text-dark-tremor-content-emphasis'
            )}
          >
            {formatDate(rawDate ?? '', groupBy)}
          </p>
        </div>

        <div className={tremorTwMerge('px-4 py-2 space-y-1')}>
          {filteredPayload.map(({ value, name, color }, idx: number) => (
            <ChartTooltipRow
              key={`id-${idx}`}
              value={value?.toString() ?? ''}
              name={name?.toString() ?? ''}
              color={color ?? ''}
            />
          ))}
        </div>
      </ChartTooltipFrame>
    )
  }
  return null
}

export { ChartTooltip }
function formatDate(date: string | number, groupBy: GroupByPeriod): string {
  let endDate: Date
  const startDate = new Date(date)
  switch (groupBy) {
    case 'day':
      endDate = new Date(startDate)
      break
    case 'week':
      endDate = endOfWeek(startDate)
      break
    case 'month':
      endDate = endOfMonth(startDate)
      break
    case 'year':
      endDate = new Date(endOfYear(startDate))
      break
    default:
      endDate = new Date(startDate)
  }
  return isSameDay(startDate, endDate)
    ? startDate.toLocaleDateString('ru')
    : `${startDate.toLocaleDateString('ru')} - ${endDate.toLocaleDateString('ru')}`
}
