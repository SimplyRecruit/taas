export default class TTBatchCreateResBody {
  id: string | null = null
  error: string | null = null
  succeeded: boolean
  constructor({
    id = null,
    error = null,
  }: {
    id?: string | null
    error?: string | null
  }) {
    this.id = id
    this.error = error
    if (this.error) this.succeeded = false
    else this.succeeded = true
  }
}
