import TrackerListItem from "@/pages/tracker/components/TrackerListItem";
import { List, Typography } from "antd";
import styles from './index.module.css'


interface RenderProps {
    data: any[]
}

export default function TrackerList({ data }: RenderProps) {
    return (
        <>
            <List
                className={styles.wrapper}
                style={{ marginBottom: 24, borderRadius: "8px 8px 2px 2px", borderBottom: "4px solid #c0caea" }}
                size="default"
                bordered
                header={<Typography.Text type="secondary" >Today</Typography.Text>}
                dataSource={data}
                renderItem={(item) => <TrackerListItem item={item} />}
            />
        </>
    )
}