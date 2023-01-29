import Link from 'next/link';
import {
  FiFilm,
  FiHash,
  // FiHome,
  FiLogOut,
  // FiPlay,
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
  // {
  //   icon: <FiHome />,
  //   label: 'Home',
  //   path: Route.Home,
  // },
  {
    icon: <FiClock />,
    label: 'Time Track',
    path: "Route.Meetings",
  },
  {
    icon: <FiCalendar />,
    label: 'Periods',
    path: "",
  },
  {
    icon: <FiUsers />,
    label: 'People',
    path: "Route.People",
  },
  // {
  //   icon: <FiPlay />,
  //   label: 'Academy',
  //   path: Route.Academy,
  // },
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
