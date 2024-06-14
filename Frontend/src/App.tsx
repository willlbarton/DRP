import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HammersmithForm from "./pages/HammersmithForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import FormViewer from "./pages/FormViewer";
import HelpPage from "./pages/HelpPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/book-call" element={<HelpPage />} />
          <Route path="/form" element={<HammersmithForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form-viewer" element={<FormViewer />} />
        </Route>
      </Routes>
      <SpeedInsights />
      <Analytics />
    </>
  );
};

export default App;