import React, { useEffect, useState } from 'react';
import { Button } from "@/common/components/ui/button";
import { useNavigate } from "react-router-dom";
import config from '@/config';
import { EditIcon, SearchIcon, UploadIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from "@/common/components/ui/use-toast"
import TaskPage from '@/common/components/datatable/page';
const ProjectsTable = () => {

    const [data, setData] = useState([]);
    const [rowsSelected, setRowsSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        fetch(config.backend_url + `projects?page=${currentPage}&size=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                data = data.map((val: any, ind: any) => {
                    val.no = ind + 1;
                    return val;
                });
                setData(data);
            })

    }, [currentPage, pageSize]);
    const sendDeleteRequest = (ids: any) => {
        fetch(config.backend_url + `projects`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(ids)
        })
            .then(response => response.json())
            .then(res => {
                if (res.status && res.status !== 200) {
                    toast({
                        description: res.detail,
                        variant: 'error'
                    });
                    setRowsSelected([]);
                } else {
                    // const parsedResponse = JSON.parse(data as string) as any[];     
                    if (res == true) {
                        setData(data.filter((val) => !ids.includes(val["id"])));
                        console.log(data);
                    }
                    setRowsSelected([]);
                }
            })
            .catch(error => {
                console.error('Error occurred:', error);
                setRowsSelected([]);
            });
    };
    return (
        <TaskPage
            onAdd={() => navigate('form')}
            onDelete={(data: any[]) => {
                const ids = data.reduce((prev, cur) => {
                    prev.push(cur.original.id);
                    return prev;
                }, []);
                sendDeleteRequest(ids);
            }}
            projects={data}
        />
    );
};

export default ProjectsTable;