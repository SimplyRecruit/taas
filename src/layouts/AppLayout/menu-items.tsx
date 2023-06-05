import { Route } from '@/constants/routes'
import { FaRegHandshake, FaUserClock } from 'react-icons/fa'
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiFileText,
  FiSettings,
  FiUsers,
} from 'react-icons/fi'

const iconSize = 16
const topItems = [
  {
    icon: <FiClock size={iconSize} />,
    label: 'timeTracker',
    path: Route.TimeTracker,
  },
  {
    icon: <FaUserClock size={18} />,
    label: 'teamTracking',
    path: Route.TeamTracking,
  },
  {
    icon: <FiBarChart2 size={iconSize} />,
    label: 'reports',
    path: Route.Reports,
  },
]

const adminItems = [
  {
    icon: <FiCalendar size={iconSize} />,
    label: 'periods',
    path: Route.Periods,
  },
  {
    icon: <FiFileText size={iconSize} />,
    label: 'projects',
    path: Route.Projects,
  },
  {
    icon: <FiUsers size={iconSize} />,
    label: 'team',
    path: Route.Team,
  },
  {
    icon: <FaRegHandshake size={iconSize} />,
    label: 'clients',
    path: Route.Clients,
  },
  {
    icon: <FiSettings size={iconSize} />,
    label: 'settings',
    path: Route.OrganizationSettings,
  },
]
export const topMenuItems = topItems
export const adminMenuItems = adminItems
