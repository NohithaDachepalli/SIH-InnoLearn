

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import HomePage from "./pages/HomePage.tsx";
import VisualizationPage from "./pages/VisualizationPage.tsx";
import PracticeMode from "./practice/pages/PracticeMode.tsx";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Always allow signup route */}
        <Route path="/signup" element={<Signup />} />
        {/* Show Login page by default if not logged in */}
        {!isLoggedIn && <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />}
        {/* After login, show HomePage and other routes */}
        {isLoggedIn && <>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualization" element={<VisualizationPage />} />
          <Route path="/practice" element={<PracticeMode />} />
        </>}
      </Routes>
    </Router>
  );
}

export default App;