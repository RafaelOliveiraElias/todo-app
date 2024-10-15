import React, { useState } from 'react';
import api from '../services/api';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (username.trim() === '') {
      setErrorMessage('Nome de usuário não pode estar vazio.');
      return;
    }

    if (password.length < 5) {
      setErrorMessage('A senha deve ter pelo menos 5 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setErrorMessage(''); 

    try {
      await api.post('/Usuario/register', {
        Username: username,
        Password: password,
      });
      
      setSuccessMessage('Registrado com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setErrorMessage('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Box
        sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registrar
        </Typography>
        <TextField
          label="Usuário*"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={!!errorMessage && !successMessage} 
        />
        <TextField
          label="Senha*"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errorMessage && !successMessage} 
        />
        <TextField
          label="Confirmar Senha*"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errorMessage && !successMessage}
        />
        {errorMessage && !successMessage && (
          <Typography variant="body2" color="error" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" color="primary" style={{ marginBottom: '16px' }}>
            {successMessage}
          </Typography>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleRegister} 
          style={{ marginTop: '20px' }}
        >
          Registrar
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
