import { useCallback, useMemo, useState } from 'react'
import { ALL_KEYWORDS, Keyword, KEYWORDS } from '~/services/vacancies/vacancies.constants'
import { VacancyData } from '~/services/vacancies/vacancies.types'
import { AreaChart, MultiSelect, MultiSelectItem, Select, SelectItem } from '@tremor/react'
import { useSearchParams } from '@remix-run/react'

type Props = {
  data: VacancyData
}

const presets = {
  None: [],
  All: ALL_KEYWORDS,
  Backend: KEYWORDS.BACKEND,
  Databases: KEYWORDS.DATABASES,
  DevOps: KEYWORDS.DEVOPS,
  Frontend: KEYWORDS.FRONTEND,
  'Frontend Frameworks': KEYWORDS.FRONTEND_FRAMEWORK,
  Mobile: KEYWORDS.MOBILE,
  ORM: KEYWORDS.ORM,
  Styles: KEYWORDS.STYLES,
  'State Management': KEYWORDS.STATE_MANAGEMENT,
  Testing: KEYWORDS.TESTING,
}

const presetsForSelect = Object.entries(presets).map(
  ([label, value]) =>
    ({
      label,
      value,
    }) as const
)

export function VacanciesChart({ data }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [preset, setPreset] = useState('None' as keyof typeof presets)

  const selectedCategories = useMemo(
    () => searchParams.get('categories')?.split(',') || [],
    [searchParams]
  )

  const setSelectedCategories = useCallback((value: Keyword[]) => {
    if (value.length === 0) {
      searchParams.delete('categories')
    } else {
      searchParams.set('categories', value.join(','))
    }

    setSearchParams(searchParams)
  }, [])

  const sortedCategories = useMemo(
    () => sortCategoriesByVacancies(selectedCategories, data),
    [selectedCategories, data]
  )

  const filteredData = useMemo(
    () =>
      data.filter(row => {
        for (const category of selectedCategories) {
          // @ts-expect-error
          if (row[category] > 0) {
            return true
          }
        }
      }),
    [data, selectedCategories]
  )

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
            onValueChange={value => setSelectedCategories(value)}
            value={selectedCategories}
          >
            {ALL_KEYWORDS.map(category => (
              <MultiSelectItem key={'category-select-' + category} value={category} />
            ))}
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
            onValueChange={value => {
              setPreset(value as keyof typeof presets)
              setSelectedCategories(presets[value as keyof typeof presets] as Keyword[])
            }}
          >
            {presetsForSelect.map(category => (
              <SelectItem key={category.label} value={category.label} />
            ))}
          </Select>
        </div>
      </div>
      <AreaChart
        connectNulls={true}
        className="h-full"
        data={filteredData}
        index="date"
        categories={sortedCategories}
        yAxisWidth={60}
        startEndOnly={false}
        intervalType="preserveStartEnd"
        showAnimation
      />
    </div>
  )
}

const sortCategoriesByVacancies = (categories: string[], data: VacancyData) => {
  const entryToCompare = data.at(-1)
  return categories.sort((a, b) => {
    if (!entryToCompare) {
      return 0
    }

    if (entryToCompare[a] === undefined && entryToCompare[b] === undefined) {
      return 0
    }
    if (entryToCompare[a] > entryToCompare[b]) {
      return -1
    }
    if (entryToCompare[a] < entryToCompare[b]) {
      return 1
    }
    return 0
  })
}
