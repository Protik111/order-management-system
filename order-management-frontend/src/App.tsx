import React, { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import apiClient from "./lib/axios";
import { Todo } from "./types";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get("/todo");
      setTodos(response.data?.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      title: text,
      time: new Date().toISOString().slice(0, 19),
    };

    const todo = await apiClient.post("/todo", newTodo);

    if (todo?.data?.success) {
      fetchTodos();
    }
  };

  const updateTodo = async (
    id: string | undefined,
    status: string
  ): Promise<void> => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: status } : todo))
    );

    const todo = await apiClient.patch(`/todo/${id}`, {
      status,
    });
  };

  const toggleTodo = async (
    id: string | undefined,
    status: string
  ): Promise<void> => {
    const todo = await apiClient.patch(`/todo/${id}`, {
      status,
    });

    if (todo?.data?.success) {
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                status:
                  todo.status === "completed" ? "uncompleted" : "completed",
              }
            : todo
        )
      );
    }
  };

  const deleteTodo = async (id: string | undefined): Promise<void> => {
    const todo = await apiClient.delete(`/todo/${id}`);
    if (todo?.data?.success) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-red-900">Todo App</h1>
      <TodoForm onSubmit={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
};

export default App;
