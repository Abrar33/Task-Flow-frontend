import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaCheckCircle, FaRegCircle, FaTrashAlt } from "react-icons/fa";

const ItemTypes = { TASK: "task" };

const TaskCard = ({darkMode, task, listId, onTaskComplete, onTaskDelete, onDropTask }) => {
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
 const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const hoverBg = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const titleColor = darkMode ? "text-gray-100" : "text-gray-900";
  const descColor = darkMode ? "text-gray-300" : "text-gray-600";
  const deadlineColor = darkMode ? "text-gray-500" : "text-gray-400";
  const completeColor = isCompleted
    ? "text-green-500 hover:text-green-600"
    : "text-gray-400 hover:text-gray-500";

  return (
   <div
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={`relative ${cardBg} ${hoverBg} rounded-xl shadow-md border ${borderColor} p-5 mb-4 cursor-pointer transition-all duration-200`}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Completion Icon */}
        <button
          onClick={() => onTaskComplete(task._id, !isCompleted)}
          className={`p-1 rounded-full focus:outline-none transition-colors ${completeColor}`}
        >
          {isCompleted ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
        </button>

        {/* Task Content */}
        <div className="flex-grow overflow-hidden">
          <h4 className={`font-semibold ${titleColor} break-words`}>
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-sm mt-1 whitespace-pre-wrap break-words ${descColor}`}
            >
              {task.description}
            </p>
          )}
          {task.deadline && (
            <span className={`text-xs mt-2 block ${deadlineColor}`}>
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
          )}
  </div>

        {/* Delete Icon */}
        <button
          onClick={() => onTaskDelete(task._id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
          title="Delete task"
        >
          <FaTrashAlt size={16} />
        </button>
      </div>
    </div>

  );
};

export default TaskCard;
