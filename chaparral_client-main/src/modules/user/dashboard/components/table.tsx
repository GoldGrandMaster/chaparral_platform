import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Table = () => {

const columns = [{
  name: "Name",
  label: "Name",
  options: {
    filter: true,
    sort: true,
   }
}, "Company", "City", "State"];

const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT"],
 ["Bob Herm", "Test Corp", "Tampa", "FL"],
 ["James Houston", "Test Corp", "Dallas", "TX"],
];

const navigate = useNavigate();

const options = {
  filterType: 'checkbox',
  customBodyRender: (dataList: any, dataIndex: any, rowIndex: any) => {
    let style: any = {};
    if (rowIndex % 2 === 0) {
      style.backgroundColor = "lightgray";
      style.cursor = 'pointer';
    }
    return (
      <tr style={style}>
        <td />
        {
          dataList.map((data: string) => {
            return (
              <td>
                <span>{data}</span>
              </td>
            )
          })
        }
      </tr>
    );
  },
  onRowClick: (data: any) => {
    navigate(`${location.pathname}/${data[0]}`)
  }
};

const theme = createTheme({
  components: {
    MUIDataTableBodyCell: {
      styleOverrides: {
        root: {
          fontFamily: 'sans-serif'
        },
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          borderTop: '1px solid rgb(226, 232, 240)',
          background: '#ccc',
        },
        root: {
          '&:nth-child(1)': {
            padding: 0,
          },
          padding: 10
        }
      }
    },
    MUIDataTableHeadCell: {
      styleOverrides: {
        data: {
          textTransform: 'capitalize',
        }
      }
    },
    MUIDataTablePagination: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      }
    },
    MUIDataTable: {
      styleOverrides: {
        root: {
          '.MuiTableCell-root': {
            border: '1px solid rgb(226, 232, 240)'
          },
          '.MuiTableHead-root th': {
            padding: 0
          },
        },
        paper: {
          boxShadow: "none",
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          maxWidth: '95%'
        }
      }
    },
    MUIDataTableBodyRow: {
      styleOverrides: {
        root: {
          '&:nth-child(odd)': { 
            backgroundColor: '#eee'
          },
          cursor: 'pointer'
        }
      }
    },
    MUIDataTableHead: {
      styleOverrides: {
        main: {
          backgroundColor: "#ddd"
        }
      }
    }
  }
});

return <ThemeProvider theme={theme}>
<MUIDataTable
  title={"People list"}
  data={data}
  columns={columns}
  // @ts-ignore
  options={options}
/>
</ThemeProvider>
}

export default Table;
