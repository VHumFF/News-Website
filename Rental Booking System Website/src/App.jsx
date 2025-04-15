import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LogIn from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import News from "./pages/News"
import Profile from "./pages/Profile"
import JournalistDashboard from "./pages/JournalistDashboard"
import ArticleEditor from "./pages/ArticleEditor"

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
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
        {/* Journalist Dashboard Route */}
        <Route path="/journalist-dashboard" element={<JournalistDashboard />} />
        {/* Article Editor Routes */}
        <Route path="/journalist/create-article" element={<ArticleEditor />} />
        <Route path="/journalist/edit-article/:articleId" element={<ArticleEditor />} />
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  )
}
