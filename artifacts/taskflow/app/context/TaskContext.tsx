import React, { createContext, useContext, useState, useCallback } from "react";
import mockTasks from "../data/mockTasks";

type Status = "pending" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  category?: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: Priority;
  status?: Status;
  dueDate?: string;
  category?: string;
}

interface Stats {
  total: number;
  pending: number;
  in_progress: number;
  done: number;
}

interface TaskContextType {
  tasks: Task[];
  createTask: (data: TaskInput) => Task;
  updateTask: (id: string, updates: Partial<TaskInput>) => Task | null;
  updateStatus: (id: string, status: Status) => Task | null;
  deleteTask: (id: string) => boolean;
  getById: (id: string) => Task | null;
  getStats: () => Stats;
  filterTasks: (filters: { status?: string; priority?: string }) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.map((t) => ({
      ...t,
      status: isStatus(t.status) ? t.status : "pending",
      priority: isPriority(t.priority) ? t.priority : "medium",
    }))
  );

  const createTask = useCallback((data: TaskInput): Task => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 5),
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      status: data.status || "pending",
      dueDate: data.dueDate,
      category: data.category,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskInput>): Task | null => {
    let result: Task | null = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated: Task = {
          ...t,
          ...updates,
          title: updates.title?.trim() ?? t.title,
          description: updates.description?.trim() ?? t.description,
        };
        result = updated;
        return updated;
      })
    );
    return result;
  }, []);

  const updateStatus = useCallback((id: string, status: Status): Task | null => {
    let result: Task | null = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, status };
        result = updated;
        return updated;
      })
    );
    return result;
  }, []);

  const deleteTask = useCallback((id: string): boolean => {
    let existed = false;
    setTasks((prev) => {
      existed = prev.some((t) => t.id === id);
      return prev.filter((t) => t.id !== id);
    });
    return existed;
  }, []);

  const getById = useCallback(
    (id: string) => tasks.find((t) => t.id === id) || null,
    [tasks]
  );

  const getStats = useCallback((): Stats => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const filterTasks = useCallback(
    ({ status, priority }: { status?: string; priority?: string }): Task[] => {
      return tasks.filter((t) => {
        if (status && status !== "all" && t.status !== status) return false;
        if (priority && priority !== "all" && t.priority !== priority)
          return false;
        return true;
      });
    },
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        updateStatus,
        deleteTask,
        getById,
        getStats,
        filterTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return ctx;
}

function isStatus(value: string): value is Status {
  return value === "pending" || value === "in_progress" || value === "done";
}

function isPriority(value: string): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}
