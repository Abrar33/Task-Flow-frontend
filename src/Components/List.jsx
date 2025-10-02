// List.jsx
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const ItemTypes = { TASK: "task" };

const List = ({
  darkMode,
  list,
  tasks,
  onAddTask,
  onTaskDrop,
  onEditTask,
  onTaskComplete,
  onTaskDelete,
  onDeleteList,
  currentUserRole,
}) => {
  const ref = useRef(null);

  // === Style Mappings (same philosophy as BoardCard) ===
  const cardBg = darkMode
    ? "bg-gradient-to-br from-gray-800 to-gray-700"
    : "bg-white";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-200";

  // Shadow + hover (consistent with BoardCard)
  const shadowClass = darkMode
    ? "shadow-xl shadow-cyan-500/30"
    : "shadow-2xl shadow-indigo-500/40";
  const hoverClass = "hover:shadow-3xl hover:shadow-indigo-500/60 hover:-translate-y-1";

  const deleteColor = darkMode
    ? "text-gray-400 hover:text-red-400"
    : "text-gray-400 hover:text-red-600";

  const addTaskButtonBg = darkMode ? "bg-gray-700" : "bg-gray-100";
  const addTaskButtonHover = darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200";

  // DnD handling
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => {
      const newPosition =
        tasks.length > 0
          ? Math.max(...tasks.map((t) => t.position)) + 1
          : 0;
      onTaskDrop(item._id, list._id, newPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isListAdmin = currentUserRole === "admin";
  drop(ref);

  return (
    <div
      ref={ref}
      className={`w-80 flex-shrink-0 flex flex-col h-full rounded-xl p-5 transition-all duration-300 
        ${cardBg} ${shadowClass} ${hoverClass} ${borderColor}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-bold ${textPrimary} truncate`}>
          {list.name}
        </h3>
        <div className="flex items-center space-x-2">
          {/* Delete List - Admin Only */}
          {isListAdmin && onDeleteList && (
            <button
              onClick={() => onDeleteList(list._id)}
              className={`p-1 rounded ${deleteColor} transition`}
              title="Delete List"
            >
              <FaTrashAlt className="text-sm" />
            </button>
          )}
          <span
            className={`text-xs px-2 py-1 rounded-full ${textSecondary} ${addTaskButtonBg}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-grow space-y-3 overflow-y-auto pr-1.5 custom-scrollbar">
        {tasks
          .sort((a, b) => a.position - b.position)
          .map((task) => (
            <TaskCard
              darkMode={darkMode}
              key={task._id}
              task={task}
              listId={list._id}
              onDropTask={onTaskDrop}
              onEditTask={onEditTask}
              onTaskComplete={onTaskComplete}
              onTaskDelete={onTaskDelete}
              currentUserRole={currentUserRole}
            />
          ))}
      </div>

      {/* Footer: Add Task / Permission */}
      {onAddTask && isListAdmin && (
        <button
          onClick={onAddTask}
          className={`w-full mt-4 p-2 flex items-center justify-center text-base font-medium rounded-lg ${textPrimary} ${addTaskButtonBg} ${addTaskButtonHover} transition duration-150 shadow-sm`}
        >
          <FaPlus className="mr-2" />
          Add a task
        </button>
      )}
      {onAddTask && !isListAdmin && (
        <p
          className={`mt-4 p-2 text-center text-sm border-t border-dashed ${textSecondary} ${borderColor}`}
        >
          Only <strong>admins</strong> can add tasks.
        </p>
      )}
    </div>
  );
};

export default List;
