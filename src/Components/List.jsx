import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { FaPlus } from "react-icons/fa";

const ItemTypes = { TASK: "task" };

const List = ({ list, tasks, onAddTask, onTaskDrop, onEditTask, onTaskComplete, onTaskDelete }) => {
  const ref = useRef(null);
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      // Find the position for the new list
      const newPosition = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) + 1 : 0;
      onTaskDrop(item._id, list._id, newPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className="w-80 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg p-4 shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {list.name}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {tasks.length}
        </span>
      </div>

      <div className="min-h-[100px]">
        {tasks
        .sort((a, b) => a.position - b.position) // 🔥 Add this sort step
        .map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            listId={list._id}
            onDropTask={onTaskDrop}
            onTaskComplete={onTaskComplete}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>

      {onAddTask && (
        <button
          onClick={onAddTask}
          className="w-full mt-4 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          <FaPlus className="mr-2" /> Add a task
        </button>
      )}
    </div>
  );
};

export default List;