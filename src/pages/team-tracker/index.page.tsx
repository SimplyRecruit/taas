import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import TrackManager from '@/components/TrackManager'

export default function TeamTracker() {
  const { data: resources, call: getAllResources } = useApi(
    'resource',
    'getAll',
    []
  )
  const { data: clients, call: getAllClients } = useApi('client', 'getAll', [])
  const { data: projects, call: getAllProjects } = useApi(
    'project',
    'getAll',
    []
  )

  useEffect(() => {
    getAllClients({ entityStatus: 'active' })
    getAllProjects({ entityStatus: 'active' })
    getAllResources({ entityStatus: 'active' })
  }, [])

  return (
    <TrackManager
      type={'team'}
      clients={clients}
      projects={projects}
      resources={resources}
    />
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
