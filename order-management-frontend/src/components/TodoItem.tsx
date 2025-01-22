import React, { useState } from "react";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string | undefined, status: string) => void;
  onUpdate: (id: string | undefined, newText: string) => void;
  onDelete: (id: string | undefined) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);

  const isChecked = todo?.status === "completed";

  const handleUpdate = () => {
    onUpdate(todo.id, isChecked ? "uncompleted" : "completed");
    setIsEditing(false);
  };

  return (
    <li className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() =>
          onToggle(todo.id, isChecked ? "uncompleted" : "completed")
        }
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleUpdate}
          onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
          className="flex-grow border rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <span
          className={`flex-grow ${
            isChecked ? "line-through text-gray-500" : ""
          }`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo?.title}
        </span>
      )}
      <button
        onClick={() => onDelete(todo.id)}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
