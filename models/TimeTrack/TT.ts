import TTBase from 'models/TimeTrack/TTBase'

export default class TT extends TTBase {
  id: string
  clientAbbr: string
  projectAbbr: string
  date: Date
}
