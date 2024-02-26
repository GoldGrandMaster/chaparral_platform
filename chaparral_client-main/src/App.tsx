import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { ThemeProvider } from "./common/components/theme-provider";
import { TailwindIndicator } from "./common/components/tailwind-indicator";
import { Toaster } from "./common/components/ui/toaster";

function App() {
  return (
    <BrowserRouter basename={'/'}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="app-container"
        >
          <Toaster />
          <div className="container-fluid view-container" id="app-view-container">
            <AppRoutes />
          </div>
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App;
