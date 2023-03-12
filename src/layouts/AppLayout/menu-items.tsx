import { Route } from '@/constants/routes'
import Link from 'next/link'
import { FaRegHandshake } from 'react-icons/fa'
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiFileText,
  FiSettings,
  FiUsers,
} from 'react-icons/fi'
import { IoGridOutline } from 'react-icons/io5'

type MenuItem = {
  icon: JSX.Element
  label: string
  path: string
}

const generateMenuItems = (items: MenuItem[]) =>
  items.map(({ label, icon, path }) => ({
    key: path.split('/')[1],
    icon: <Link href={path}>{icon}</Link>,
    label: <Link href={path}>{label}</Link>,
  }))

const iconSize = 16
const topItems = [
  {
    icon: <FiClock size={iconSize} />,
    label: 'Time Track',
    path: Route.TimeTrack,
  },
  {
    icon: <FiCalendar size={iconSize} />,
    label: 'Periods',
    path: Route.Periods,
  },
  {
    icon: <FiBarChart2 size={iconSize} />,
    label: 'Reports',
    path: Route.Reports,
  },
]

const analyseItems = [
  {
    icon: <IoGridOutline size={iconSize} />,
    label: 'Dashboard',
    path: Route.DashBoard,
  },
]
const adminItems = [
  {
    icon: <FiFileText size={iconSize} />,
    label: 'Projects',
    path: Route.Projects,
  },
  {
    icon: <FiUsers size={iconSize} />,
    label: 'Team',
    path: Route.Team,
  },
  {
    icon: <FaRegHandshake size={iconSize} />,
    label: 'Clients',
    path: Route.Clients,
  },
  {
    icon: <FiSettings size={iconSize} />,
    label: 'Settings',
    path: Route.OrganizationSettings,
  },
]
export const topMenuItems = generateMenuItems(topItems)
export const analyseMenuItems = generateMenuItems(analyseItems)
export const adminMenuItems = generateMenuItems(adminItems)
