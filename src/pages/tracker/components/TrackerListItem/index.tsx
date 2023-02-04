import { List } from "antd";


interface RenderProps {
    item: any
}

export default function TrackerListItem({ item }: RenderProps) {
    return (
        <>
            <List.Item>{item}</List.Item>
        </>
    )
}