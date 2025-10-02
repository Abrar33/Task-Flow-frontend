const API_BASE_URL = import.meta.env.API_BASE_URL || "https://task-flow-backend-umber.vercel.app";

const callApi = async (url, method, data = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    };

    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

// --- TASK APIs ---

// Get all tasks for a board
export const getTasksByBoard = (boardId) =>
  callApi(`${API_BASE_URL}/api/tasks/${boardId}/tasks`, "GET");

// Create a new task for a board
export const createTask = (boardId, taskData) =>
  callApi(`${API_BASE_URL}/api/tasks/${boardId}/tasks`, "POST", taskData);

// Update a task
export const updateTask = (id, taskId, taskData) =>
  callApi(`${API_BASE_URL}/api/tasks/${id}/tasks/${taskId}`, "PATCH", taskData);

// Delete a task
export const deleteTask = (boardId, taskId) =>
  callApi(`${API_BASE_URL}/api/tasks/${boardId}/tasks/${taskId}`, "DELETE");
