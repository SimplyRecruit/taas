import moment from 'dayjs'
import { Project } from 'models'
export const dummyData: Project[] = [
  {
    id: '0',
    name: 'Kurulum',
    client: 'A101',
    startDate: moment(new Date('2023/10/10')),
    active: true,
  },
  {
    id: '1',
    name: 'Bakım',
    client: 'BİM',
    startDate: moment(new Date()),
    active: false,
  },
]
