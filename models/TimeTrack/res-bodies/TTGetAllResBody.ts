import Model from 'models/common/Model'
import TT from 'models/TimeTrack/TT'

export default class TTGetAllResBody extends Model {
  data: TT[]
  count: number
}
