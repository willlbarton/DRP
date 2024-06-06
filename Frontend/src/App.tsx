// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HammersmithForm from "./pages/HammersmithForm";
import Register from "./pages/Register";
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
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/form" element={<HammersmithForm />} />
      </Routes>
      </>
  );
};

export default App;