import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Store from './store/Store.jsx';
import { Providerui } from "@/components/ui/provider"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Providerui>
    <Provider store={Store}>
      <App />
      {/* <Toaster /> */}
    </Provider>
  </Providerui>
    
  </BrowserRouter>
)
