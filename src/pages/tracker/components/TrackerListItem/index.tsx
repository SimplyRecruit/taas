import { Button, Input, List } from "antd";
import {PlusCircleOutlined} from "@ant-design/icons"
import { FiPlusCircle } from "react-icons/fi";


interface RenderProps {
    item: any
}

export default function TrackerListItem({ item }: RenderProps) {
    return (
        <>
            <List.Item>
                <Input bordered={false} style={{ maxWidth: 250 }} value={item}></Input>
                <Button type="text" ><PlusCircleOutlined />Project</Button>
            </List.Item>
        </>
    )
}