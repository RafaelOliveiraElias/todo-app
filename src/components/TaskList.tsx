import React, { useEffect, useState } from 'react';
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Paper,
  Box,
  TextField,
  Modal,
  TableSortLabel,
} from '@mui/material';

import { fetchTasks, toggleTask, deleteTask, createTask, updateTask } from '../services/taskService';

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<{ title: string; description: string; category: string }>({
    title: '',
    description: '',
    category: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [orderBy, setOrderBy] = useState<'title' | 'description' | 'category'>('title');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    getTasks();
  }, []);

  const handleToggle = async (taskId: number, isCompleted: boolean) => {
    try {
      await toggleTask(taskId, isCompleted);
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, isCompleted: !isCompleted } : task)));
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erro ao deletar a tarefa:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setOpenModal(true);
  };

  const handleCreateTask = async () => {
    try {
      const task = await createTask(newTask);
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', category: '' });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditTask(null);
  };

  const handleUpdateTask = async () => {
    if (editTask) {
      try {
        await updateTask(editTask);
        setTasks(tasks.map(task => (task.id === editTask.id ? editTask : task)));
        handleModalClose();
      } catch (error) {
        console.error('Erro ao atualizar a tarefa:', error);
      }
    }
  };

  const handleSort = (column: 'title' | 'description' | 'category') => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const valueA = a[orderBy].toLowerCase();
    const valueB = b[orderBy].toLowerCase();

    if (orderDirection === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Minhas Tarefas
      </Typography>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px' }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Criar Nova Tarefa
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Título"
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Descrição"
            variant="outlined"
            multiline
            rows={4}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Categoria"
            variant="outlined"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreateTask} style={{ marginTop: '10px' }}>
          Adicionar Tarefa
        </Button>
      </Paper>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderDirection}
                    onClick={() => handleSort('title')}
                  >
                    <strong>Título</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderDirection}
                    onClick={() => handleSort('category')}
                  >
                    <strong>Categoria</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ width: '40%' }}>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderDirection}
                    onClick={() => handleSort('description')}
                  >
                    <strong>Descrição</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center"><strong>Completa</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.category}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={task.isCompleted}
                      onChange={() => handleToggle(task.id, task.isCompleted)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(task)}
                        style={{ marginRight: '10px' }}
                      >
                        Alterar
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(task.id)}>
                        Deletar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal open={openModal} onClose={handleModalClose}>
        <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#fff', margin: 'auto', marginTop: '50px', width: '80%', maxWidth: '600px' }}>
          <Typography variant="h6" gutterBottom>
            Editar Tarefa
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Título"
              variant="outlined"
              value={editTask?.title || ''}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value } as Task)}
            />
            <TextField
              fullWidth
              label="Descrição"
              variant="outlined"
              multiline
              rows={4}
              value={editTask?.description || ''}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value } as Task)}
            />
            <TextField
              fullWidth
              label="Categoria"
              variant="outlined"
              value={editTask?.category || ''}
              onChange={(e) => setEditTask({ ...editTask, category: e.target.value } as Task)}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={handleUpdateTask} style={{ marginTop: '10px' }}>
            Salvar Alterações
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default TaskList;
