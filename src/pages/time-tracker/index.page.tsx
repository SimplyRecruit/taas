import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import TrackManager from '@/components/TrackManager'

export default function Tracker() {
  const { data: clientsAndProjects, call: getClientsAndProjects } = useApi(
    'resource',
    'getClientsAndProjects'
  )

  useEffect(() => {
    getClientsAndProjects({ id: 'me' })
  }, [])

  return clientsAndProjects ? (
    <TrackManager
      type={'time'}
      clients={clientsAndProjects.clients}
      projects={clientsAndProjects.projects}
      resources={undefined}
    />
  ) : null
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
