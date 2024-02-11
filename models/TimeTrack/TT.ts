import TTBase from 'models/TimeTrack/TTBase'

export default class TT extends TTBase {
  id: string
  date: Date
  userAbbr: string | undefined
  partnerName: string | undefined
}
