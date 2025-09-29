// boardPage 
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPlus, FaCog, FaExclamationCircle, FaUsers, FaTrashAlt, FaCrown, FaUser, FaTimes } from "react-icons/fa"; 

import List from "../Components/List";
import TaskModal from "../Components/taskModal";
import InviteModal from "../Components/inviteModal";

import { useBoardContext } from "../context/boardContext";
import { useAuth } from "../context/authContext";
import { useSocket } from "../context/socketContext";
import { useNotifications } from "../context/notificationsContext";
import toast from "react-hot-toast";

const BoardPage = () => {
  const { boardId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const { addNotification } = useNotifications();
  const currentUserId = user.id;

  const {
    selectedBoard,
    loading,
    error,
    fetchBoardById,
    updateExistingTask,
    addTask,
    setSelectedBoard,
    addListToBoard, // this should update lists in context
    inviteUserToBoard,
    removeTask,
    removeListFromBoard,
    removeUser
  } = useBoardContext();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentListId, setCurrentListId] = useState(null);
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)
  //
  // --- Determine current user's role ---
  //
  const currentUserRole = useMemo(() => {
    if (!selectedBoard || !currentUserId) return "guest";

    const member = selectedBoard.members?.find(
      (m) => m?.user?._id === currentUserId
    );

    return member?.role || "guest";
  }, [selectedBoard, currentUserId]);
console.log(selectedBoard);
  //
  // --- Fetch board on mount ---
  //
  useEffect(() => {
    if (boardId) {
      if (!selectedBoard || selectedBoard._id !== boardId) {
        fetchBoardById(boardId);
      }
    }
  }, [boardId, selectedBoard, fetchBoardById]);

  //
  // --- Join board room & listen for real-time events ---
  //
  useEffect(() => {
    if (!socket || !boardId) return;

    socket.emit("joinBoard", boardId);

   const handleListCreated = (list) => {
  console.log("📥 Real-time new list:", list);
  
  setSelectedBoard((prev) => {
    if (!prev) return prev;
    const exists = prev.lists?.some((l) => l._id === list._id);
    if (exists) return prev;
    return { ...prev, lists: [...(prev.lists || []), list] };
  });

  toast.success(`New list created: ${list.name}`);
  addNotification({
    _id: list._id,
    message: `List "${list.name}" was created`,
    isRead: false,
    createdAt: new Date(),
  });
};


    socket.on("listCreated", handleListCreated);

    return () => {
      socket.off("listCreated", handleListCreated);
    };
  }, [socket, boardId, addListToBoard, addNotification]);

  //
  // --- Task movement (Drag & Drop) ---
  //
// In BoardPage.jsx

// In BoardPage.jsx

const handleTaskDrop = useCallback(
  async (taskId, newListId, newPosition) => {
    // ... permission checks ...

    // Optimistic update
    setSelectedBoard((prevBoard) => {
      if (!prevBoard) return prevBoard;
      
      const updatedTasks = prevBoard.tasks.map((t) =>
        t._id === taskId
          ? { ...t, listId: newListId, position: newPosition }
          : t
      );
      
      // ✅ No need to sort here, List component handles it.
      return { ...prevBoard, tasks: updatedTasks };
    });

    try {
      // ... API call to update the task on the server ...
      await updateExistingTask(selectedBoard._id, taskId, {
        listId: newListId,
        position: newPosition,
      });
    } catch (err) {
      console.error("Task update failed:", err);
      // ... Rollback logic (important for error handling) ...
      if (selectedBoard) fetchBoardById(selectedBoard._id);
    }
  },
  [selectedBoard, updateExistingTask, fetchBoardById, currentUserRole, setSelectedBoard]
);

  //
  // --- Task Modal Handlers ---
  //
  const handleAddTask = (listId) => {
    if (currentUserRole !== "admin") {
      alert("Only administrators can add tasks.");
      return;
    }
    setSelectedTask(null);
    setCurrentListId(listId);
    setIsTaskModalOpen(true);
  };
const handleDeleteList = useCallback(async (listId) => {
  if (!selectedBoard) return;
  if (currentUserRole !== "admin") {
   toast.error("Only administrators can delete lists.");
   return;
  }

  if (!window.confirm("Are you sure you want to delete this list and all its tasks?")) {
   return;
  }

  try {
   // Optimistic update
   setSelectedBoard(prev => {
    if (!prev) return prev;
    return {
     ...prev,
     lists: prev.lists.filter(l => l._id !== listId),
     tasks: prev.tasks.filter(t => t.listId !== listId), // Also remove tasks
    }
   });

   await removeListFromBoard(selectedBoard._id, listId);
   toast.success("List deleted successfully.");
  } catch (err) {
   console.error("Failed to delete list:", err);
   toast.error("Failed to delete list. Re-fetching board.");
   fetchBoardById(selectedBoard._id); // Rollback/Resync
  }
 }, [selectedBoard, currentUserRole, removeListFromBoard, fetchBoardById, setSelectedBoard]);


 //
 // --- Member Removal Handler (NEW) ---
 //
const handleRemoveMember = useCallback(async (userId, username) => {
 if (!selectedBoard) return;
 if (currentUserRole !== "admin") {
  toast.error("Only administrators can remove members.");
  return;
 }

 if (userId === currentUserId) {
  toast.error("You cannot remove yourself this way. Use the Leave Board option instead.");
  return;
 }

 if (!window.confirm(`Are you sure you want to remove ${username} from the board?`)) {
  return;
 }

 try {
  // Context's removeUser handles the API call and updates setSelectedBoard
  await removeUser(selectedBoard._id, userId);
  toast.success(`${username} has been removed.`);
  setIsMembersModalOpen(false);
 } catch (err) {
  console.error("Error removing user:", err);
  toast.error("Failed to remove member.");
 }
}, [selectedBoard, currentUserRole, removeUser, currentUserId]);
  const handleEditTask = (task) => {
    if (currentUserRole !== "admin") {
      alert("Only administrators can edit tasks.");
      return;
    }
    setSelectedTask(task);
    setCurrentListId(task.listId);
    setIsTaskModalOpen(true);
  };

  const handleTaskComplete = useCallback(
    async (taskId, completed) => {
      if (currentUserRole !== "admin" && currentUserRole !== "member") {
        alert("You do not have permission to update this task.");
        return;
      }
      try {
        await updateExistingTask(boardId, taskId, { completed });
      } catch (err) {
        console.error("Failed to update task completion:", err);
      }
    },
    [boardId, updateExistingTask, currentUserRole]
  );

  const handleTaskDelete = useCallback(
    async (taskId) => {
      if (currentUserRole !== "admin") {
        alert("Only administrators can delete tasks.");
        return;
      }
      try {
        setSelectedBoard((prevBoard) => {
          if (!prevBoard) return prevBoard;
          return {
            ...prevBoard,
            tasks: prevBoard.tasks.filter((t) => t._id !== taskId),
          };
        });
        await removeTask(boardId, taskId);
      } catch (err) {
        console.error("Failed to delete task:", err);
        fetchBoardById(boardId);
      }
    },
    [boardId, removeTask, fetchBoardById, currentUserRole, setSelectedBoard]
  );

  const saveTask = async (taskData) => {
    if (!selectedBoard) return;
    if (currentUserRole !== "admin") {
      alert("Only administrators can save tasks.");
      return;
    }
    try {
      if (taskData._id) {
        await updateExistingTask(selectedBoard._id, taskData._id, taskData);
      } else {
        await addTask(selectedBoard._id, {
          ...taskData,
          listId: currentListId,
        });
      }
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  //
  // --- Add List (API) ---
  //
  const handleAddList = async () => {
    if (!newListName.trim() || !selectedBoard) return;
    if (currentUserRole !== "admin") {
      alert("Only administrators can add lists.");
      return;
    }
    try {
      await addListToBoard(selectedBoard._id, { name: newListName });
      // real-time will push list to everyone in board
      setAddingList(false);
      setNewListName("");
    } catch (err) {
      console.error("Failed to add list:", err);
    }
  };

  //
  // --- Invite Member ---
  //
 const handleInviteMember = async (email) => {
  if (!selectedBoard) return;
  try {
    await inviteUserToBoard(selectedBoard._id, email);
    toast.success("Invitation sent successfully!");
  } catch (err) {
    // backend sends { message: 'User is already a member of this board' }
    const errorMsg = err?.message || "Failed to send invite.";
    toast.error(errorMsg);
  }
};

const MembersListModal = () => {
  if (!isMembersModalOpen) return null;

  const members = selectedBoard.members || [];
  const isAdmin = currentUserRole === "admin";

const sortedMembers = [...members].sort((a, b) => {
  if (a.role === "admin" && b.role !== "admin") return -1;
  if (a.role !== "admin" && b.role === "admin") return 1;
console.log(a,b,'chek')
  const nameA = a.user?.name || "";
  const nameB = b.user?.name || "";
  return nameA.localeCompare(nameB);
});

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6">
     <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Board Members</h2>
      <button onClick={() => setIsMembersModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition">
       <FaTimes className="text-xl" />
      </button>
     </div>

     <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {sortedMembers.map((member) => (
       <div key={member.user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <div className="flex items-center space-x-3 truncate">
         {member.role === "admin" ? (
          <FaCrown className="text-yellow-500 flex-shrink-0" title="Admin" />
         ) : (
          <FaUser className="text-blue-500 flex-shrink-0" title="Member" />
         )}
         <span className={`font-medium ${member.user._id === currentUserId ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'} truncate`}>
          {member.user.name}
          {member.user._id === currentUserId && " (You)"}
         </span>
         <span className="text-xs text-gray-500 dark:text-gray-400">({member.role})</span>
        </div>
        {isAdmin && member.user._id !== currentUserId && (
         <button
          onClick={() => handleRemoveMember(member.user._id, member.user.name)}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded transition flex-shrink-0"
          title={`Remove ${member.user.username}`}
         >
          <FaTrashAlt />
         </button>
        )}
       </div>
      ))}
     </div>
    </div>
   </div>
  );
 };
  //
  // --- Loading / Error States ---
  //
  if (loading || !selectedBoard?.lists || !selectedBoard?.tasks) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400">
        <FaCog className="animate-spin text-4xl" />
        <span className="ml-2">Loading board...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <FaExclamationCircle className="text-4xl mb-2" />
        <span className="text-lg">Error loading board or board not found.</span>
      </div>
    );
  }

  //
  // --- Render ---
  //
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Board header with invite */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span>{selectedBoard.name}</span>
          </h1>
          <div className="flex space-x-2">
            {/* Members Button (NEW) */}
            <button
              onClick={() => setIsMembersModalOpen(true)}
              className="flex items-center space-x-1 text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
            >
              <FaUsers /> <span>Members ({selectedBoard.members?.length || 0})</span>
            </button>
          {currentUserRole === "admin" && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center space-x-1 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              <FaPlus /> <span>Invite</span>
            </button>
          )}
        </div>
</div>
        {/* Lists */}
        <div className="flex flex-row space-x-4 min-h-full ">
          {selectedBoard.lists.map((list) => {
            const listTasks = selectedBoard.tasks.filter(
              (t) => t.listId === list._id
            );
            return (
              <List
              
                key={list._id}
                list={list}
                tasks={listTasks}
                onTaskDrop={handleTaskDrop}
                onAddTask={
                  currentUserRole === "admin"
                    ? () => handleAddTask(list._id)
                    : undefined
                }
                onEditTask={handleEditTask}
                boardMembers={selectedBoard.members}
                onTaskComplete={handleTaskComplete}
                onTaskDelete={handleTaskDelete}
              />
            );
          })}

          {/* Add List Card - Only visible to admins */}
          {currentUserRole === "admin" && (
            <div className="w-80 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
              {!addingList ? (
                <button
                  onClick={() => setAddingList(true)}
                  className="w-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  <FaPlus className="mr-2" /> Add another list
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddList}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Add List
                    </button>
                    <button
                      onClick={() => {
                        setAddingList(false);
                        setNewListName("");
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={saveTask}
        task={selectedTask}
        currentListId={currentListId}
        boardMembers={selectedBoard.members}
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
      {isMembersModalOpen ?
       <MembersListModal /> : null
      }
    </DndProvider>
  );
};

export default BoardPage;
