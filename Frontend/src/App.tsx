// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HammersmithForm from "./pages/HammersmithForm";
import HammersmithUpload from "./pages/HammersmithUpload";
import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<HammersmithForm />} />
        <Route path="/upload" element={<HammersmithUpload />} />
      </Routes>
      </>
  );
};

export default App;