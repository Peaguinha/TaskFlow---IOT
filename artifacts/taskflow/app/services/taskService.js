import mockTasks from "../data/mockTasks";

let tasks = [...mockTasks];

export const taskService = {
  getAll() {
    return [...tasks];
  },

  getById(id) {
    return tasks.find((t) => t.id === id) || null;
  },

  create(taskData) {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      ...taskData,
    };
    tasks = [newTask, ...tasks];
    return newTask;
  },

  updateStatus(id, newStatus) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    return tasks.find((t) => t.id === id) || null;
  },

  update(id, updates) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    return tasks.find((t) => t.id === id) || null;
  },

  delete(id) {
    const existed = tasks.some((t) => t.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    return existed;
  },

  filter({ status, priority } = {}) {
    return tasks.filter((t) => {
      if (status && status !== "all" && t.status !== status) return false;
      if (priority && priority !== "all" && t.priority !== priority)
        return false;
      return true;
    });
  },

  getStats() {
    const all = tasks;
    return {
      total: all.length,
      pending: all.filter((t) => t.status === "pending").length,
      in_progress: all.filter((t) => t.status === "in_progress").length,
      done: all.filter((t) => t.status === "done").length,
    };
  },
};

export default taskService;
