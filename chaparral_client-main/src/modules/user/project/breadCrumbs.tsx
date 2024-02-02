import Breadcrumbs from '@mui/material/Breadcrumbs';
import {
  useLocation, useNavigate,
} from 'react-router-dom';
import { styled } from 'styled-components';
import { Chip, PaletteMode } from '@mui/material';
import { useTheme } from 'next-themes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
function Page() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').slice(3).filter((x) => x);
  const { setTheme, theme } = useTheme();
  const handleClick = (index: number) => {
    navigate(location.pathname.split('/').slice(0, index + 4).join('/'));
  }

  return (
    <ThemeProvider theme={createTheme({
      palette: {
        mode: (theme ? theme : 'dark') as PaletteMode
      }
    })}>
      <Breadcrumbs aria-label="breadcrumb">
        <Chip component="span" onClick={() => handleClick(-1)} label={"Project"} />

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;

          return <Chip component="span" label={decodeURIComponent(value)} onClick={() => !last && handleClick(index)} clickable={true} />
        })}
      </Breadcrumbs>
    </ThemeProvider>
  );
}

export default Page;