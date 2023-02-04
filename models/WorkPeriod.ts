import { Matches } from "class-validator";
import Model from "models/Model";

const regex = /^(0?[1-9]|1[012])\/(20\d{2})$/

export default class WorkPeriod extends Model {
    @Matches(regex)
    private period: string

    get periodDate() {
        const [_, month, year] = this.period.match(regex)!
        return new Date(Date.UTC(Number.parseInt(year), Number.parseInt(month)))
    }
}