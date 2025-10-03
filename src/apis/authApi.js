import axios from 'axios'
const API_URL = import.meta.env.API_BASE_URL ||'https://taskflow-backend-production-73ac.up.railway.app'

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/register` , userData)
  return response.data
}
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/login`, userData)
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}