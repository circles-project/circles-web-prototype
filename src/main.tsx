import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './index.css'

import WelcomePage from './pages/WelcomePage/WelcomePage';
import LandingPage from './pages/Registration/LandingPage/LandingPage';
import App from './pages/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* only support dark theme after login for now (due to background image and no user settings) */}
      {/* <div data-bs-theme="dark">

      </div> */}

      <div>
        <Routes>
          {/* todo: add conditional if signed in vs signed out */}
          {/* <Route path="/" element={<WelcomePage />} /> */}
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
