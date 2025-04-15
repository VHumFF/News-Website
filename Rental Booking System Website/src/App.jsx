import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LogIn from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import News from "./pages/News"
import Profile from "./pages/Profile"
import JournalistDashboard from "./pages/JournalistDashboard"
import ArticleEditor from "./pages/ArticleEditor"
import AdminDashboard from "./pages/AdminDashboard"
import ArticlePage from "./pages/ArticlePage"
import AccountActivation from "./pages/AccountActivation"
import JournalistActivation from "./pages/JournalistActivation"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/activate/:token" element={<AccountActivation />} />
        <Route path="/activate-journalist/:token" element={<JournalistActivation />} />
        <Route path="/home" element={<Home />} />
        {/* Default News Route */}
        <Route path="/news" element={<News />} />
        {/* Dynamic News Routes */}
        <Route path="/news/:filter" element={<News />} />
        <Route path="/news/:category/:filter" element={<News />} />
        {/* Article Detail Route */}
        <Route path="/news/article/:articleId/:slug" element={<ArticlePage />} />
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
        {/* Journalist Dashboard Route */}
        <Route path="/journalist-dashboard" element={<JournalistDashboard />} />
        {/* Article Editor Routes */}
        <Route path="/journalist/create-article" element={<ArticleEditor />} />
        <Route path="/journalist/edit-article/:articleId" element={<ArticleEditor />} />
        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  )
}
