import { IsInt, IsOptional, IsPositive, Matches, Min } from "class-validator";

const sortByRegex = /^(\~|\-)([a-zA-Z0-9_]*)$/

export default class TableQueryParameters {
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
        const order: { [column: string]: 'asc' | 'desc' } = {}
        if (this.sortBy == null) return order
        for (const sort of this.sortBy) {
            const [_, direction, column] = sort.match(sortByRegex)!
            order[column] = direction === '~' ? 'asc' : 'desc'
        }
        return order
    }

    get take() { return this.limit }

    get skip() { return this.offset }
}