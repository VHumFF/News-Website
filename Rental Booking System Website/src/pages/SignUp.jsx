import React from 'react';
import SignUpPage from '@/features/auth/SignUpPage';
import { Container, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Register() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SignUpPage />
    </Box>
  );
}
