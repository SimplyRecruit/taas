import Model from 'models/Model'
import TT from 'models/TimeTrack/TT'

export default class TTGetAllResBody extends Model {
  data: TT[]
  count: number
}
