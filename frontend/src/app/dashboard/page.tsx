"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "COMPLETED";
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  // 🔐 Route Protection
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      fetchTasks();
    }
  }, [user, search]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks", {
        params: { search },
      });
      setTasks(response.data.tasks);
    } catch {
      console.error("Failed to fetch tasks");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      alert("Failed to create task");
    }
  };

  const handleToggle = async (id: string) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">
            Task Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Create Task */}
        <form
          onSubmit={handleCreateTask}
          className="flex gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Task title"
            className="flex-1 p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Description"
            className="flex-1 p-3 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 rounded-lg hover:opacity-90 transition"
          >
            Add
          </button>
        </form>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No tasks yet. Create your first task 🚀
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-gray-100 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {task.description}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`px-3 py-1 rounded text-white transition ${
                      task.status === "COMPLETED"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {task.status}
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
