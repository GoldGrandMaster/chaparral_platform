"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { PlusIcon, TrashIcon } from "lucide-react"
import { MouseEventHandler } from "react"

interface DataTableToolbarProps<TData> {
    table: Table<TData>,
    onAdd: MouseEventHandler,
    onDelete: any
}

export function DataTableToolbar<TData>({
    table,
    onAdd,
    onDelete
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            {
                table.getIsSomeRowsSelected() &&
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto h-8 lg:flex"
                    onClick={() => onDelete(table.getSelectedRowModel().flatRows)}
                >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            }
            <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8 lg:flex"
                onClick={onAdd}
            >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New
            </Button>
            <DataTableViewOptions table={table} />
        </div>
    )
}