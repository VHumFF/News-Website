import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import News from "./pages/News";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        {/* Default News Route */}
        <Route path="/news" element={<News />} />
        {/* Dynamic News Routes */}
        <Route path="/news/:filter" element={<News />} />
        <Route path="/news/:category/:filter" element={<News />} />
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}
