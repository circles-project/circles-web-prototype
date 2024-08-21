import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage/WelcomePage';
import LandingPage from './pages/Registration/LandingPage/LandingPage.tsx';

const App = () => {
  return (
    <>
    {/* only support dark theme after login for now (due to background image and no user settings) */}
      {/* <div data-bs-theme="dark">

      </div> */}

    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<LandingPage />} />
      </Routes>
    </div>
    </>
  );
};

export default App;
