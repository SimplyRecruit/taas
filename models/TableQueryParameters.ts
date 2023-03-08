import { IsInt, IsOptional, IsPositive, Matches, Min } from 'class-validator'

const sortByRegex = /^(~|-)([a-zA-Z0-9_]*)$/
const ASC_OPERATOR = '~'
const DESC_OPERATOR = '-'

export default class TableQueryParameters {
  constructor(sortBy?: string[], limit?: number, offset?: number) {
    this.sortBy = sortBy
    this.limit = limit
    this.offset = offset
  }

  public static create({
    sortBy,
    pageSize,
    page,
  }: {
    sortBy?: { column: string; direction: 'ASC' | 'DESC' }[]
    pageSize: number
    page: number
  }) {
    return new this(
      sortBy?.map(
        e => (e.direction === 'ASC' ? ASC_OPERATOR : DESC_OPERATOR) + e.column
      ),
      pageSize,
      (page - 1) * pageSize
    )
  }

  @IsOptional()
  @Matches(sortByRegex, { each: true })
  private sortBy?: string[]

  @IsOptional()
  @IsInt()
  @IsPositive()
  private limit?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  private offset?: number

  get order() {
    const order: { [column: string]: 'ASC' | 'DESC' } = {}
    if (this.sortBy == null) return order
    for (const sort of this.sortBy) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-non-null-assertion
      const [_, direction, column] = sort.match(sortByRegex)!
      order[column] = direction === ASC_OPERATOR ? 'ASC' : 'DESC'
    }
    return order
  }

  get take() {
    return this.limit
  }

  get skip() {
    return this.offset
  }
}
