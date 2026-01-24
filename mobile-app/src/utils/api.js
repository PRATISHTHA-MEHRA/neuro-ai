import axios from 'axios';
import { API_BASE_URL } from '../constants/theme';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateWord = async (letter) => {
  try {
    const response = await api.get(`/generate_word/${letter}`);
    return response.data;
  } catch (error) {
    console.error('Error generating word:', error);
    throw error;
  }
};

export const testWord = async (letter) => {
  try {
    const response = await api.get(`/test/${letter}`);
    return response.data;
  } catch (error) {
    console.error('Error testing word:', error);
    throw error;
  }
};

export const recordAudio = async () => {
  try {
    const response = await api.get('/record');
    return response.data;
  } catch (error) {
    console.error('Error recording audio:', error);
    throw error;
  }
};

export const getRemedy = async (percentage) => {
  try {
    const response = await api.get(`/remedy/${percentage}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching remedy:', error);
    throw error;
  }
};

export default api;
