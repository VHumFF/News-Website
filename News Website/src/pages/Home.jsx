"use client"

import { useEffect } from "react"
import { Box } from "@mui/material"
import Header from "@/components/Header"
import HomePage from "@/features/home/HomePage"

export default function Home() {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", boxShadow: 0 }}>
      {/* Navbar */}
      <Header />
      <HomePage />
    </Box>
  )
}
