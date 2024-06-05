// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/HammersmithForm";
import Upload from "./pages/HammersmithUpload";

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
};

export default App;