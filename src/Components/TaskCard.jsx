import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaCheckCircle, FaRegCircle, FaTrashAlt } from "react-icons/fa";

const ItemTypes = { TASK: "task" };

const TaskCard = ({ task, listId, onTaskComplete, onTaskDelete, onDropTask }) => {
  const ref = useRef(null);

  // Enable dragging
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { _id: task._id, listId, position: task.position },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  // Enable dropping (reordering + cross-list moving)
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item._id === task._id) return; // skip self

      const dragIndex = item.position;
      const hoverIndex = task.position;

      // Bounding box of hovered element
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Prevent rapid swaps (only trigger if cursor passes half the item)
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      onDropTask(item._id, listId, hoverIndex);

      // Update dragged item’s state so it doesn’t jitter
      item.position = hoverIndex;
      item.listId = listId;
    },
  });

  drag(drop(ref));

  const isCompleted = task.completed;

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md p-5 mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
    >
      <div className="flex justify-between items-start gap-4">
        {/* Completion Icon */}
        <button
          onClick={() => onTaskComplete(task._id, !isCompleted)}
          className={`p-1 rounded-full focus:outline-none transition-colors ${
            isCompleted
              ? "text-green-500 hover:text-green-600"
              : "text-gray-400 hover:text-gray-500"
          }`}
        >
          {isCompleted ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
        </button>

        {/* Task Content */}
        <div className="flex-grow overflow-hidden">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 break-words">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words">
              {task.description}
            </p>
          )}
          {task.deadline && (
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Delete Icon */}
        <button
          onClick={() => onTaskDelete(task._id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
        >
          <FaTrashAlt size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
