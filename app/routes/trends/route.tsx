import { json, MetaFunction } from '@remix-run/node'
import { vacanciesService } from '~/services/vacancies/vacancies.service'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { VacanciesChart } from '~/components/vacancies-chart'
import type { ShouldRevalidateFunction } from '@remix-run/react'

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextParams }) => {
  return !nextParams
}
export const meta: MetaFunction = ({ location }) => {
  const preset = new URLSearchParams(location.search).get('preset')

  return [
    { title: preset ? `Vacancies trends for ${preset}` : 'Vacancies trends' },
    { name: 'description', content: 'See how software vacancies change over time' },
  ]
}

export const loader = async () => {
  const promises = [
    vacanciesService.getAggregateByCreatedAt(),
    vacanciesService.getKeywords(),
  ] as const
  const [vacancies, keywords] = await Promise.all(promises)
  return json({ vacancies, keywords })
}

export default function Trends() {
  const { vacancies, keywords } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const preset = searchParams.get('preset')
  const heading = preset ? `Trends for ${preset}` : 'Trends'

  return (
    <div className={'flex h-full flex-col gap-6'}>
      <h1 className={'text-2xl font-semibold'}>{heading}</h1>
      <VacanciesChart data={vacancies} keywords={keywords} />
    </div>
  )
}
