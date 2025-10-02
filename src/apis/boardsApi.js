// frontend/src/api/boardApi.js

// This file centralizes all API calls related to the board resource using Axios.
import axios from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://task-flow-backend-umber.vercel.app';

const getAuthToken = () => {
  // Replace with your actual logic to get the JWT from localStorage, a cookie, etc.
  return localStorage.getItem('authToken');
};

const getAuthHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  }
});

// Create a new board
export const createBoard = async (boardData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/boards`, boardData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all boards for the logged-in user
export const getBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/boards`, getAuthHeaders());
    console.log("Boards API response:", response.data);
    return Array.isArray(response.data) ? response.data : response.data.boards || [];
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error.response?.data || error;
  }
};


// Get a single board by ID
export const getBoardById = async (boardId) => {
 try {
  const response = await axios.get(`${API_BASE_URL}/api/boards/${boardId}`, getAuthHeaders());
  return response.data;
 } catch (error) {
  throw error.response.data;
 }
};

// Update a board
export const updateBoard = async (boardId, boardData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/boards/${boardId}`, boardData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addListToBoard = async (boardId, listData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/boards/${boardId}/lists`, listData, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
// Delete a board
export const deleteBoard = async (boardId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/boards/${boardId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Invite a user to a board
export const inviteUserToBoard = async (boardId, email, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/boards/${boardId}/invite`, { email, role }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Delete a list from a board
export const deleteListFromBoard = async (boardId, listId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/boards/${boardId}/lists/${listId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeUserFromBoard = async (id, userId) => {
 try {
  // Merge the data ({ userId }) and the authentication headers into one config object
  const config = {
   ...getAuthHeaders(), // Includes the 'Authorization' header
   data: { userId },   // Specifies the request body for the DELETE request
  };
    
  const response = await axios.delete(
   `${API_BASE_URL}/api/boards/${id}/remove-user`,
   config
  );
  return response.data;
 } catch (error) {
  throw error.response?.data || error;
 }
};
