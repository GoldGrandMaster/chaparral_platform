import "./App.css";
import { Card } from 'reactstrap';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import AppRoutes from './routes';
import { ThemeProvider } from "./common/components/theme-provider";
import { TailwindIndicator } from "./common/components/tailwind-indicator";
import { useEffect } from "react";

function App() {
  return (
    <BrowserRouter basename={'/'}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="app-container"
        >
          <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
          <div className="container-fluid view-container" id="app-view-container">
            <Card className="jh-card">
              <AppRoutes />
            </Card>
          </div>
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;
