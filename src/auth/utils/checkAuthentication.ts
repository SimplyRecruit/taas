import Route from '@/src/shared/routes';
import { GetServerSideProps } from 'next';

export const authRoutes: string[] = [
  Route.Login,
];

const checkAuthentication: GetServerSideProps = async (context) => {
  const resolvedPath = context.resolvedUrl.split('?')[0];
  try {
    // check auth
    if (authRoutes.includes(resolvedPath)) {
      return {
        redirect: {
          destination: Route.TimeTrack,
          permanent: false,
        },
      };
    }
    return {
      props: {
        authenticated: true,
      },
    };
  } catch {
    if (!authRoutes.includes(resolvedPath)) {
      return {
        redirect: {
          destination: Route.Login,
          permanent: false,
        },
      };
    }
    return {
      props: {
        authenticated: false,
      },
    };
  }
};

export default checkAuthentication;
