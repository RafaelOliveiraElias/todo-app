import api from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/Tarefa', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

export const toggleTask = async (taskId: number, isCompleted: boolean): Promise<void> => {
  try {
    const newIsCompleted = !isCompleted;
    await api.put(`/Tarefa/${taskId}/completa?isCompleted=${newIsCompleted}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar a tarefa:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await api.delete(`/Tarefa/${taskId}`);
  } catch (error) {
    console.error('Erro ao deletar a tarefa:', error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'isCompleted'>): Promise<Task> => {
  try {
    const response = await api.post('/Tarefa', {
      ...task,
      isCompleted: false,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<void> => {
  try {
    await api.put(`/Tarefa/${task.id}`, task);
  } catch (error) {
    console.error('Erro ao atualizar a tarefa:', error);
    throw error;
  }
};
