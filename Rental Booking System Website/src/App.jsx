import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import News from "./pages/News";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        x<Route path="/news" element={<News />} />
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}
