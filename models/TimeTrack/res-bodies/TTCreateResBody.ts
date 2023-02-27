export default class TTCreateResBody {
  id: string | null = null
  error: string | null = null
  constructor({
    id = null,
    error = null,
  }: {
    id?: string | null
    error?: string | null
  }) {
    this.id = id
    this.error = error
  }
}
