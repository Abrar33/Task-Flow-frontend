// frontend/src/context/boardContext.js
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  inviteUserToBoard,
  addListToBoard as addListApi,
  removeUserFromBoard,
  deleteListFromBoard,
} from "../apis/boardsApi";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByBoard,
} from "../apis/taskApi";
import { useSocket } from "./socketContext";

const BoardContext = createContext();
export const useBoardContext = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socket = useSocket();

  // --- Boards ---
  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoards();
      setBoards(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addBoard = useCallback(async (boardData) => {
    try {
      const newBoard = await createBoard(boardData);
      setBoards((prev) => [...prev, newBoard]);
      return newBoard;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchBoardById = useCallback(async (boardId) => {
    if (!boardId) return;
    setLoading(true);
    setError(null);
    try {
      const [boardData, tasks] = await Promise.all([
        getBoardById(boardId),
        getTasksByBoard(boardId),
      ]);
      setSelectedBoard({
        ...boardData,
        tasks: Array.isArray(tasks) ? tasks : [],
      });

      if (socket) socket.emit("joinBoard", boardId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [socket]);

  const addListToBoard = useCallback(async (boardId, listData) => {
    try {
      const updatedBoard = await addListApi(boardId, listData);
      setSelectedBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      console.error("Error adding list:", err);
      setError(err.message);
      throw err;
    }
  }, []);

  // --- Tasks ---
  const addTask = useCallback(async (boardId, taskData) => {
    try {
      const newTask = await createTask(boardId, taskData);
     

      if (socket)
        socket.emit("taskChanged", { boardId, type: "created", task: newTask });

      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket]);

  const updateExistingTask = useCallback(async (boardId, taskId, taskData) => {
    try {
      const updatedTask = await updateTask(boardId, taskId, taskData);
      setSelectedBoard((prev) =>
        prev
          ? {
              ...prev,
              tasks: (prev.tasks || []).map((t) =>
                t._id === taskId ? updatedTask : t
              ),
            }
          : prev
      );

      if (socket)
        socket.emit("taskChanged", {
          boardId,
          type: "updated",
          task: updatedTask,
        });

      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket]);

  const removeTask = useCallback(async (boardId, taskId) => {
    try {
      await deleteTask(boardId, taskId);
      setSelectedBoard((prev) =>
        prev
          ? {
              ...prev,
              tasks: (prev.tasks || []).filter((t) => t._id !== taskId),
            }
          : prev
      );

      if (socket)
        socket.emit("taskChanged", { boardId, type: "deleted", taskId });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket]);

  // --- Realtime listeners ---
  useEffect(() => {
    if (!socket) return;

    const handleTaskChanged = ({ type, task, taskId }) => {
      setSelectedBoard((prev) => {
        if (!prev) return prev;

        if (type === "created") {
          const exists = prev.tasks.some((t) => t._id === task._id);
          if (!exists) {
            return { ...prev, tasks: [...prev.tasks, task] };
          }
        }
        if (type === "updated") {
          return {
            ...prev,
            tasks: prev.tasks.map((t) => (t._id === task._id ? task : t)),
          };
        }
        if (type === "deleted") {
          return {
            ...prev,
            tasks: prev.tasks.filter((t) => t._id !== taskId),
          };
        }
        return prev;
      });
    };

    const handleListChanged = ({ type, list, boardId }) => {
      setSelectedBoard((prev) => {
        if (!prev || prev._id !== boardId) return prev;

        if (type === "created") {
          const exists = prev.lists?.some((l) => l._id === list._id || l.name === list.name);
          if (!exists) {
            return { ...prev, lists: [...(prev.lists || []), list] };
          }
        }

        return prev;
      });
    };

    socket.on("taskChanged", handleTaskChanged);
    socket.on("listChanged", handleListChanged);

    return () => {
      socket.off("taskChanged", handleTaskChanged);
      socket.off("listChanged", handleListChanged);
    };
  }, [socket]);

  // --- Cleanup: leave board when unmounted or board changes
  useEffect(() => {
    return () => {
      if (socket && selectedBoard?._id) {
        socket.emit("leaveBoard", selectedBoard._id);
      }
    };
  }, [socket, selectedBoard?._id]);
const removeListFromBoard = useCallback(async (boardId, listId) => {
  try {
    const updatedBoard = await deleteListFromBoard(boardId, listId);

    setSelectedBoard((prev) =>
      prev && prev._id === boardId ? { ...prev, lists: updatedBoard.lists } : prev
    );

    if (socket)
      socket.emit("listChanged", {
        type: "deleted",
        listId,
        boardId,
      });

    return updatedBoard;
  } catch (err) {
    console.error("Error deleting list:", err);
    setError(err.message);
    throw err;
  }
}, [socket]);

// --- Members ---
// frontend/src/context/boardContext.js

// ... (other functions)

// --- Members ---
const removeUser = useCallback(async (boardId, userId) => {
  try {
    // OPTIMISTIC UPDATE: Remove user from local state immediately
    setSelectedBoard((prev) => {
      if (!prev || prev._id !== boardId) return prev;
      return {
        ...prev,
        members: prev.members.filter((m) => m.user._id !== userId),
      };
    });

    const updatedBoard = await removeUserFromBoard(boardId, userId);

    // 💡 NEW: Trigger a re-fetch of the board to ensure all data (lists, tasks, members)
    // is fully synchronized after a major change. This avoids the stale/loading board issue.
    // Use the helper to avoid race conditions:
    if (boardId) {
      await fetchBoardById(boardId);
    }
    
    // Fallback/socket logic
    if (socket)
      socket.emit("boardChanged", {
        type: "memberRemoved",
        boardId,
        removedUserId: userId,
      });

    return updatedBoard;
  } catch (err) {
    console.error("Error removing user:", err);
    setError(err.message);
    // 💡 IMPORTANT: On failure, you should call fetchBoardById(boardId) to roll back
    // the optimistic update and sync the state with the server.
    if (boardId) {
      fetchBoardById(boardId);
    }
    throw err;
  }
}, [socket, fetchBoardById]); // ⬅️ Add fetchBoardById to the dependency array
  const value = useMemo(
    () => ({
      boards,
      selectedBoard,
      loading,
      error,
      fetchBoards,
      addBoard,
      fetchBoardById,
      setSelectedBoard,
      addTask,
      addListToBoard,
      updateExistingTask,
      removeTask,
      inviteUserToBoard,
      removeListFromBoard,
      removeUser,
    }),
    [
      boards,
      selectedBoard,
      loading,
      error,
      fetchBoards,
      addBoard,
      fetchBoardById,
      addListToBoard,
      addTask,
      updateExistingTask,
      removeTask,
      removeListFromBoard,
      removeUser,
    ]
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};