import { json, MetaFunction } from '@remix-run/node'
import { vacanciesService } from '~/services/vacancies/vacancies.service'
import { useLoaderData } from '@remix-run/react'
import { VacanciesChart } from '~/components/vacancies-chart'
import type { ShouldRevalidateFunction } from '@remix-run/react'

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextParams }) => {
  return !nextParams
}
export const meta: MetaFunction = () => {
  return [
    { title: 'Vacancies trends' },
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

export default function Index() {
  const { vacancies, keywords } = useLoaderData<typeof loader>()
  return <VacanciesChart data={vacancies} keywords={keywords} />
}
