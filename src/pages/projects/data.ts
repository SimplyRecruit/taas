import Project from 'models/Project'

export const dummyData: Project[] = [
  {
    id: '0',
    name: 'Kurulum',
    client: 'A101',
    startDate: new Date('2023/10/10'),
    active: true,
  },
  {
    id: '1',
    name: 'Bakım',
    client: 'BİM',
    startDate: new Date(),
    active: false,
  },
]
