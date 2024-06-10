import { Vacancies, VacancyData } from '~/services/vacancies/vacancies.types'

export class VacanciesService {
  baseUrl = 'https://vacancies-trends-api.andrii.es'

  async getAll(): Promise<Vacancies> {
    return await fetch(`${this.baseUrl}/vacancies`).then(res => res.json())
  }

  async getAggregateByCreatedAt(): Promise<VacancyData> {
    return await fetch(`${this.baseUrl}/vacancies/aggregated`)
      .then(res => res.json())
      .then(this.formatDateOnData)
  }

  formatDateOnData(data: VacancyData): VacancyData {
    return data.map(item => {
      return {
        ...item,
        date: new Date(item.date).toLocaleDateString('ru'),
      }
    })
  }
}

export const vacanciesService = new VacanciesService()
