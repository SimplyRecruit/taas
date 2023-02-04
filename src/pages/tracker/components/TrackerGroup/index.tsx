import TrackerList from "@/pages/tracker/components/TrackerList";
import TrackerListItem from "@/pages/tracker/components/TrackerListItem";
import { List, Typography } from "antd";


interface RenderProps {
    data: any[]
}

export default function TrackerGroup({ data }: RenderProps) {
    return (
        <>
            <Typography.Paragraph>
                Dec 19
                -
                Dec 25
                ,
                2022
            </Typography.Paragraph>
            <div>
                <TrackerList data={data}></TrackerList>
                <TrackerList data={data}></TrackerList>
            </div>
        </>
    )
}