import { Card, List, Typography } from "antd";
import styles from './TrackerList.module.css'


interface RenderProps {
    data: any[]
}

export default function TrackerList({ data }: RenderProps) {
    return (
        <>
            <div style={{ padding: 10 }}>
                <List
                    className={styles.wrapper}
                    size="large"
                    bordered
                    header={<Typography.Text type="secondary" >Today</Typography.Text>}
                    dataSource={data}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />
            </div>
        </>
    )
}