import React, { useState } from 'react';
import api from '../services/api';
import { Button, TextField, Typography, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/Usuario/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);

      navigate('/tasks');

    } catch (error) {
      setError('Erro ao fazer login. Verifique seu usuário e senha.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '100px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: '16px' }}
        >
          Login
        </Button>
        <Link to="/register" style={{ display: 'block', marginTop: '16px', textAlign: 'center' }}>
          Não tem uma conta? Registre-se aqui
        </Link>
      </Paper>
    </Container>
  );
};

export default Login;
