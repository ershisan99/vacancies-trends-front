import { json, MetaFunction } from '@remix-run/node'
import { vacanciesService } from '~/services/vacancies/vacancies.service'
import { useLoaderData } from '@remix-run/react'
import { VacanciesChart } from '~/components/vacancies-chart'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async () => {
  const vacancies = await vacanciesService.getAggregateByCreatedAt()
  return json({ vacancies })
}

export default function Index() {
  const { vacancies } = useLoaderData<typeof loader>()
  return <VacanciesChart data={vacancies} />
}
