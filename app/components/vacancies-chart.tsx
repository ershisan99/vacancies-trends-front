import { useCallback, useMemo } from 'react'
import { GroupByPeriod, KeywordsResponse, VacancyData } from '~/services/vacancies/vacancies.types'
import { AreaChart, MultiSelect, MultiSelectItem, Select, SelectItem, Switch } from '@tremor/react'
import { useSearchParams } from '@remix-run/react'
import { capitalize } from 'remeda'
import { ChartTooltip } from '~/components/ui/chart-tooltip'

type Props = {
  data?: VacancyData
  keywords?: KeywordsResponse
}

export function VacanciesChart({ data, keywords }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()

  const presetsForSelect = useMemo(
    () =>
      Object.entries(keywords?.presets ?? {}).map(
        ([label, value]) =>
          ({
            label,
            value,
          }) as const
      ),
    [keywords?.presets]
  )

  const selectedCategories = useMemo(
    () => searchParams.get('categories')?.split(',') || [],
    [searchParams]
  )

  const preset = useMemo(() => {
    return searchParams.get('preset') ?? 'None'
  }, [searchParams])

  const showTotal = useMemo(() => searchParams.get('showTotal') === 'true', [searchParams])
  const groupBy: GroupByPeriod = useMemo(() => {
    return (searchParams.get('groupBy') ?? 'day') as GroupByPeriod
  }, [searchParams])

  const setPreset = useCallback(
    (value: string | null) => {
      if (!value || value === 'None') {
        searchParams.delete('preset')
      } else {
        searchParams.set('preset', value)
      }

      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )
  const setShowTotal = useCallback(
    (value: boolean) => {
      if (value) {
        searchParams.set('showTotal', 'true')
      } else {
        searchParams.delete('showTotal')
      }
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const categoriesForChart = useMemo(() => {
    const filtered = [
      ...(data?.categories.filter(category => selectedCategories.includes(category)) ?? []),
    ]
    if (showTotal) {
      filtered.unshift('total')
    }
    return filtered
  }, [selectedCategories, data?.categories, showTotal])

  const setSelectedCategories = useCallback(
    (value: string[]) => {
      if (value.length === 0) {
        searchParams.delete('categories')
      } else {
        searchParams.set('categories', value.join(','))
      }

      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const setGroupBy = useCallback(
    (value: string) => {
      if (!value || value === 'day') {
        searchParams.delete('groupBy')
      } else {
        searchParams.set('groupBy', value)
      }

      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  const filteredData = useMemo(
    () =>
      data?.data
        ?.filter(row => {
          for (const category of selectedCategories) {
            const value = row[category]
            if (typeof value === 'number' && value > 0) {
              return true
            }
          }
          if (showTotal) {
            const value = row['total']
            if (typeof value === 'number' && value > 0) {
              return true
            }
          }
        })
        ?.map(({ date, ...rest }) => ({
          ...rest,
          date: new Date(date).toLocaleDateString('ru'),
          rawDate: date,
        })) ?? [],
    [data?.data, selectedCategories, showTotal, groupBy]
  )

  const handlePresetChange = useCallback(
    (value: string) => {
      setPreset(value)
      setSelectedCategories(keywords?.presets[value] ?? [])
    },
    [keywords?.presets, setSelectedCategories, setPreset]
  )

  const handleKeywordsChange = useCallback(
    (value: string[]) => {
      setSelectedCategories(value ?? [])
      setPreset(null)
    },
    [setSelectedCategories, setPreset]
  )

  const multiSelectItems = useMemo(() => {
    return keywords?.allKeywords.map(category => (
      <MultiSelectItem key={'category-select-' + category} value={category} />
    ))
  }, [keywords?.allKeywords])

  const presetSelectItems = useMemo(() => {
    return presetsForSelect.map(category => (
      <SelectItem key={'preset-select-item-' + category.label} value={category.label} />
    ))
  }, [presetsForSelect])

  const groupBySelectItems = useMemo(
    () =>
      Object.entries(GroupByPeriod).map(([label, value]) => (
        <SelectItem key={'groupBy-select-item-' + label} value={value}>
          {capitalize(value)}
        </SelectItem>
      )),
    []
  )

  return (
    <>
      <div className={'flex gap-4'}>
        <div className="max-w-xl">
          <label
            htmlFor="categories"
            className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
          >
            Technologies to compare
          </label>
          <MultiSelect
            id={'categories'}
            onValueChange={handleKeywordsChange}
            value={selectedCategories}
          >
            {multiSelectItems}
          </MultiSelect>
        </div>

        <div className="max-w-xl">
          <label
            htmlFor="presets"
            className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
          >
            Preset
          </label>
          <Select
            value={preset}
            id={'presets'}
            defaultValue={'All'}
            onValueChange={handlePresetChange}
          >
            {presetSelectItems}
          </Select>
        </div>
        <div className="max-w-xl">
          <label
            htmlFor="groupBy"
            className="text-tremor-default text-tremor-content dark:text-dark-tremor-content"
          >
            Group by
          </label>
          <Select value={groupBy} id={'groupBy'} defaultValue={'day'} onValueChange={setGroupBy}>
            {groupBySelectItems}
          </Select>
        </div>
        <label
          htmlFor="Show total"
          className="max-w-xl flex self-center mt-6 gap-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content select-none"
        >
          Show total
          <Switch checked={showTotal} onChange={setShowTotal} id={'Show total'} />
        </label>
      </div>
      <AreaChart
        connectNulls={true}
        customTooltip={args => (
          <ChartTooltip {...args} groupBy={groupBy} rawDate={args.payload?.payload?.rawDate} />
        )}
        enableLegendSlider
        className="h-full"
        data={filteredData}
        index="date"
        categories={categoriesForChart}
        yAxisWidth={60}
        startEndOnly={false}
        intervalType="preserveStartEnd"
        showAnimation
        noDataText={'Nothing here, try selecting different categories or preset'}
      />
    </>
  )
}
