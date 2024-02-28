"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/common/components/ui/checkbox"

import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { EditIcon, SearchIcon, UploadIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
export const columns: ColumnDef<Task>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "no",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="No" />
        ),
        cell: ({ row }) => <div>{row.getValue("no")}</div>,
        enableSorting: false
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="w-[100px] truncate font-medium text-xl">
                    {row.getValue("name")}
                </div>
            )
        },
        enableSorting: false
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => <div className="w-[200px]">{row.getValue("description")}</div>,
        enableSorting: false,
    },
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Action" />
        ),
        cell: ({ row }) => {
            const navigate = useNavigate();
            return (
                <div className="flex flex-row gap-3">
                    <EditIcon
                        onClick={(e) => {
                            localStorage.setItem("currentProject", JSON.stringify(row.original));
                            navigate('edit');
                        }}
                    />
                    <UploadIcon
                        onClick={(e) => {
                            localStorage.setItem("currentProject", JSON.stringify(row.original));
                            navigate('upload');
                        }}
                    />
                    <SearchIcon
                        onClick={(e) => {
                            localStorage.setItem("currentProject", JSON.stringify(row.original));
                            navigate('search');
                        }}
                    />
                </div>
            )
        },
        enableSorting: false
    },
]