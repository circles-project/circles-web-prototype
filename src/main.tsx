import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './index.css'

import WelcomePage from './pages/WelcomePage/WelcomePage';
import LandingPage from './pages/Registration/LandingPage/LandingPage';
import App from './pages/App';

import './main.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* todo: add conditional if signed in vs signed out */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<WelcomePage />} />
        <Route path="/signup" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
