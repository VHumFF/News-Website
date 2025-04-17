import { Box } from "@mui/material"
import Header from "../components/Header"
import ArticleEditorPage from "../features/journalist/ArticleEditorPage"

export default function ArticleEditor() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <ArticleEditorPage />
      </Box>
    </Box>
  )
}
