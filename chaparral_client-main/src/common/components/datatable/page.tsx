import { Metadata } from "next"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export const metadata: Metadata = {
    title: "Projects",
    description: "A brief projects viewer",
}

export default function TaskPage(props: any) {
    return <DataTable data={props.projects} onAdd={props.onAdd} onDelete={props.onDelete} columns={columns} />
}