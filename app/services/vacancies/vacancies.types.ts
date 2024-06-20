export type Vacancies = VacancyDataEntry[]

export interface VacancyDataEntry {
  createdAt: string
  id: number
  technology: string
  updatedAt: string
  vacancies: number
}

export type VacancyData = {
  categories: string[]
  data: Array<{ date: string; [key: string]: string | number }>
}

export type KeywordsResponse = {
  allKeywords: string[]
  keywords: Record<string, string[]>
  presets: Record<string, string[]>
}
