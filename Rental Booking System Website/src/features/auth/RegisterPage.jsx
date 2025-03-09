import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register Submitted', form);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'center' }}>
        <Typography variant="h5">Register</Typography>
        <TextField label="Full Name" name="name" fullWidth required onChange={handleChange} />
        <TextField label="Email" name="email" fullWidth required onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth required onChange={handleChange} />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Register
        </Button>
        <Link component="button" variant="body2" onClick={() => navigate('/login')}>
          Already have an account? Log in here
        </Link>
      </Box>
    </Container>
  );
}
