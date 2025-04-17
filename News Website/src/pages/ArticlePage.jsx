import { Box } from "@mui/material"
import Header from "../components/Header"
import ArticleDetailPage from "../features/article/ArticleDetailPage"

export default function ArticlePage() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <ArticleDetailPage />
      </Box>
    </Box>
  )
}
