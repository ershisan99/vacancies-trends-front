export type Vacancies = VacancyDataEntry[]

export interface VacancyDataEntry {
  createdAt: string
  id: number
  technology: string
  updatedAt: string
  vacancies: number
}

export type VacancyData = Array<{ date: string; [key: string]: string | number }>
