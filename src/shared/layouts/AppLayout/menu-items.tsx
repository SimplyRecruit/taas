import Route from '@/src/shared/routes';
import Link from 'next/link';
import {
  FiLogOut,
  FiSettings,
  FiCalendar,
  FiUsers,
  FiClock,
} from 'react-icons/fi';

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
  {
    icon: <FiUsers />,
    label: 'People',
    path: "Route.People",
  },
];

const bottomItems = [
  {
    icon: <FiSettings />,
    label: 'Settings',
    path: "Route.SettingsProfile",
  },
  {
    icon: <FiLogOut />,
    label: 'Log out',
    path: "Route.Logout",
  },
];

export const topMenuItems = generateMenuItems(topItems);
export const bottomMenuItems = generateMenuItems(bottomItems);
