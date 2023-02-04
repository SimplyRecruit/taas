import TrackerList from "@/pages/tracker/components/TrackerList/TrackerList";
import { Card, List, Typography } from "antd";
import styles from "antd/lib/list"

export default function Tracker() {
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
  return (
    <>
      <div style={{ padding: 10 }}>

        <TrackerList data={data} />
        <List

          size="large"
          footer={<div>Footer</div>}
          bordered
          header={<Typography style={{ backgroundColor: "grey" }}>Today</Typography>}
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </>
  )
}