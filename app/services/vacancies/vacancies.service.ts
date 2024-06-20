import { KeywordsResponse, Vacancies, VacancyData } from '~/services/vacancies/vacancies.types'

export class VacanciesService {
  baseUrl = process.env.VACANCIES_API_URL ?? 'https://vacancies-trends-api.andrii.es'

  async getAll(): Promise<Vacancies> {
    return await fetch(`${this.baseUrl}/vacancies`).then(res => res.json())
  }

  async getAggregateByCreatedAt(): Promise<VacancyData> {
    return await fetch(`${this.baseUrl}/vacancies/aggregated`)
      .then(res => res.json())
      .then(this.formatDateOnData)
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
