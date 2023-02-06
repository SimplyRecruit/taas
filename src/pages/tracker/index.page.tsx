import TrackerGroup from '@/pages/tracker/components/TrackerGroup'

export default function Tracker() {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ]
  return (
    <>
      <div style={{ padding: 24 }}>
        <TrackerGroup data={data} />
        <TrackerGroup data={data} />
      </div>
    </>
  )
}
