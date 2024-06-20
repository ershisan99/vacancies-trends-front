import { json, MetaFunction } from '@remix-run/node'
import { vacanciesService } from '~/services/vacancies/vacancies.service'
import { Link, ShouldRevalidateFunction, useLoaderData } from '@remix-run/react'
import { Tooltip } from '~/components/ui/tooltip'

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
  const keywords = await vacanciesService.getKeywords()
  return json({ keywords })
}

export default function Index() {
  const { keywords } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1 className={'text-2xl font-semibold mb-6'}>Compare vacancies trends over time</h1>
      <div className={'flex flex-col gap-2'} role={'list'}>
        {Object.entries(keywords?.presets ?? {}).map(([label, values]) => {
          if (values.length === 0) return null

          return (
            <Tooltip content={<TooltipContent values={values} />} key={label}>
              <Link
                role={'listitem'}
                className={'text-blue-300 hover:underline w-max'}
                to={{
                  pathname: '/trends',
                  search: new URLSearchParams({
                    preset: label,
                    categories: values.join(','),
                  }).toString(),
                }}
              >
                {label}
              </Link>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

const TooltipContent = ({ values }: { values: string[] }) => {
  return (
    <div>
      {[...values].sort().map(v => (
        <div key={v}>{v}</div>
      ))}
    </div>
  )
}
