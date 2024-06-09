import { Vacancies, VacancyData } from '~/services/vacancies/vacancies.types'

export class VacanciesService {
  async getAll(): Promise<Vacancies> {
    return await fetch('http://localhost:4321/vacancies').then(res => res.json())
  }
  async getAggregateByCreatedAt(): Promise<VacancyData> {
    return await fetch('http://localhost:4321/vacancies/aggregated')
      .then(res => res.json())
      .then(this.formatDateOnData)
  }

  formatDateOnData(data: VacancyData): VacancyData {
    return data.map(item => {
      return {
        ...item,
        date: new Date(item.date).toLocaleTimeString('ru'),
      }
    })
  }
}

export const vacanciesService = new VacanciesService()
