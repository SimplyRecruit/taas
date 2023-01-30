import { Route } from '@/constants/routes';
import Link from 'next/link';
import { FaRegHandshake } from "react-icons/fa";
import {
  FiBarChart2, FiCalendar, FiClock,
  FiFileText, FiSettings, FiUsers
} from 'react-icons/fi';
import { IoGridOutline } from "react-icons/io5";

type MenuItem = {
  icon: JSX.Element;
  label: string;
  path: string;
};

const generateMenuItems = (items: MenuItem[]) =>
  items.map(({ label, icon, path }) => ({
    key: path.split('/')[1],
    icon: <Link href={path}>{icon}</Link>,
    label: <Link href={path}>{label}</Link>,
  }));

const topItems = [
  {
    icon: <FiClock />,
    label: 'Time Track',
    path: Route.TimeTrack,
  },
  {
    icon: <FiCalendar />,
    label: 'Periods',
    path: Route.Periods,
  },
];

const analyseItems = [
  {
    icon: <IoGridOutline />,
    label: 'Dashboard',
    path: Route.DashBoard,
  },
  {
    icon: <FiBarChart2 />,
    label: 'Reports',
    path: Route.Reports,
  },
];
const adminItems = [
  {
    icon: <FiFileText />,
    label: 'Projects',
    path: Route.Projects,
  },
  {
    icon: <FiUsers />,
    label: 'Team',
    path: Route.Team,
  },
  {
    icon: <FaRegHandshake />,
    label: 'Clients',
    path: Route.Clients,
  },
  {
    icon: <FiSettings />,
    label: 'Settings',
    path: Route.OrganizationSettings,
  },
];
export const topMenuItems = generateMenuItems(topItems);
export const analyseMenuItems = generateMenuItems(analyseItems);
export const adminMenuItems = generateMenuItems(adminItems);
