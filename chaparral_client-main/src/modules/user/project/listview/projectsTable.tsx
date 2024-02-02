import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button } from "@/common/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from '@/config';
import { toast } from 'react-toastify';
import { IconButton, PaletteMode } from '@mui/material';
import { EditIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

const ProjectsTable = () => {

    const [data, setData] = useState([]);
    const [rowsSelected, setRowsSelected] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const { setTheme, theme } = useTheme();

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
                if (data.msg && data.msg != 200) {
                    console.log(data.detail);
                    toast.error(data.detail);
                } else {
                    // const parsedResponse = JSON.parse(data as string) as any[];
                    data = data.map((val: any, ind: any) => {
                        val.no = ind + 1;
                        return val;
                    });
                    setData(data);
                }
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
                console.log(res);
                if (res.status && res.status !== 200) {
                    toast.error(res.detail);
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
    const customTheme = createTheme({
        palette: {
            mode: (theme ? theme : 'dark') as PaletteMode
        },
        components: {
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        padding: "16px 24px 16px 24px"
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        fontSize: "20px",
                    }
                }
            },
            // MUIDataTableToolbar: {
            //     styleOverrides: {
            //         root: {
            //             backgroundColor: '#2196F3', // Pretty blue header
            //             color: '#fff',
            //         },
            //     },
            // },
            MUIDataTableSelectCell: {
                styleOverrides: {
                    headerCell: {
                        backgroundColor: theme == 'light' ? '#e7edf3' : '#3658d6'
                    }
                }
            },
            MUIDataTableHeadCell: {
                styleOverrides: {
                    root: {
                        backgroundColor: theme == 'light' ? '#e7edf3' : '#3658d6',
                        padding: '0px 0px',
                    },

                },
            },
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        fontSize: '20px',
                    },
                },
            },
            MUIDataTableBodyRow: {
                styleOverrides: {
                    root: {
                        '&:nth-of-type(even)': {
                            background: theme == "light" ? '#efefef' : '#131519', // Alternating row background color
                        },
                    },
                },
            },
        },
    });

    const columns = [
        {
            name: 'no',
            label: "No",
            options: {

                sort: false
            }
        },
        {
            name: 'id',
            label: 'ID',
            options: {
                display: false,
                viewColumns: false,
                filter: false,
                sort: false,
            }
        },
        {
            name: 'name',
            label: 'Name',
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: 'description',
            label: 'Description',
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: 'createdDate',
            label: 'Created Date',
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: 'action',
            label: 'Action',
            options: {
                sort: false,
                filter: false,
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <div>
                            <IconButton
                                onClick={(e) => {
                                    localStorage.setItem("currentProject", JSON.stringify(tableMeta.rowData));
                                    navigate('edit');
                                    // handleEdit(tableMeta.rowData[0]);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    )
                }
            }
        }
    ];

    const handleAddNew = () => {
        navigate('/user/project/form')
    };

    return (
        <div>
            <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary"
                onClick={handleAddNew}>
                Add New
            </Button>

            <div className="mt-[20px] mr-[20px]">
                {data &&
                    <ThemeProvider theme={customTheme}>
                        <MUIDataTable
                            title="Projects"
                            data={data}
                            columns={columns}
                            options={{
                                serverSide: false,
                                download: false,
                                print: false,
                                responsive: "standard",
                                rowsSelected: rowsSelected,
                                onRowsDelete: (rowsDeleted) => {
                                    const del = rowsDeleted.lookup;
                                    // console.log(Object.keys(del).map(val => data[val].id));
                                    sendDeleteRequest(Object.keys(del).map(val => data[Number(val)]["id"]))
                                    return false;
                                    // rowsDeleted.
                                    // return false;
                                }
                                // onTableChange: (action, tableState) => {
                                //     if (action === 'changePage') {
                                //         setCurrentPage(tableState.page);
                                //     }
                                //     else if (action === 'changeRowsPerPage') {
                                //         setPageSize(tableState.rowsPerPage);
                                //     }
                                // },
                            }}
                        />
                    </ThemeProvider>
                }
            </div>
        </div>
    );
};

export default ProjectsTable;