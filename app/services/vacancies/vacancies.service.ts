import {
  GroupByPeriod,
  KeywordsResponse,
  Vacancies,
  VacancyData,
} from '~/services/vacancies/vacancies.types'

export class VacanciesService {
  baseUrl = process.env.VITE_VACANCIES_API_URL ?? 'https://vacancies-trends-api.andrii.es'

  async getAll(args?: { groupBy?: GroupByPeriod }): Promise<Vacancies> {
    const groupBy = args?.groupBy ?? GroupByPeriod.DAY
    const params = new URLSearchParams({
      groupBy,
    })

    const url = new URL(`${this.baseUrl}/vacancies`)
    url.search = params.toString()
    return await fetch(url.toString()).then(res => res.json())
  }

  async getAggregateByCreatedAt(args?: { groupBy?: GroupByPeriod }): Promise<VacancyData> {
    const groupBy = args?.groupBy ?? GroupByPeriod.DAY

    const params = new URLSearchParams({
      groupBy,
    })
    const url = new URL(`${this.baseUrl}/vacancies/aggregated`)
    url.search = params.toString()

    return await fetch(url).then(res => res.json())
  }

  async getKeywords(): Promise<KeywordsResponse> {
    return await fetch(`${this.baseUrl}/vacancies/keywords`).then(res => res.json())
  }

  private formatDateOnData(data: VacancyData): VacancyData {
    const mapped = data.data.map(item => {
      return {
        ...item,
        date: new Date(item.date).toLocaleDateString('ru'),
      }
    })
    return {
      ...data,
      data: mapped,
    }
  }
}

export const vacanciesService = new VacanciesService()
