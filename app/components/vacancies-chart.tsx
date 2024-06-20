import { useCallback, useMemo, useState } from 'react'
import { KeywordsResponse, VacancyData } from '~/services/vacancies/vacancies.types'
import { AreaChart, MultiSelect, MultiSelectItem, Select, SelectItem } from '@tremor/react'
import { useSearchParams } from '@remix-run/react'

type Props = {
  data?: VacancyData
  keywords?: KeywordsResponse
}

export function VacanciesChart({ data, keywords }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [preset, setPreset] = useState('None')

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

  const categoriesForChart = useMemo(() => {
    return data?.categories.filter(category => selectedCategories.includes(category)) ?? []
  }, [selectedCategories, data?.categories])

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

  const filteredData = useMemo(
    () =>
      data?.data?.filter(row => {
        for (const category of selectedCategories) {
          const value = row[category]
          if (typeof value === 'number' && value > 0) {
            return true
          }
        }
      }) ?? [],
    [data?.data, selectedCategories]
  )

  const handlePresetChange = useCallback(
    (value: string) => {
      setPreset(value)
      setSelectedCategories(keywords?.presets[value] ?? [])
    },
    [keywords?.presets, setSelectedCategories]
  )

  const handleKeywordsChange = useCallback(
    (value: string[]) => {
      setSelectedCategories(value ?? [])
    },
    [setSelectedCategories]
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

  return (
    <div className={'flex h-full flex-col gap-6 p-8'}>
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
      </div>
      <AreaChart
        connectNulls={true}
        className="h-full"
        data={filteredData}
        index="date"
        categories={categoriesForChart}
        yAxisWidth={60}
        startEndOnly={false}
        intervalType="preserveStartEnd"
        showAnimation
      />
    </div>
  )
}
