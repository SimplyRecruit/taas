import TTBase from 'models/TimeTrack/TTBase'

export default class TT extends TTBase {
  id: string
  date: Date
  userId?: string
  userAbbr?: string
}
