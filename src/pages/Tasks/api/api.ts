import tasks from "../../../utils/__mocks__/tasks";
import type { Task } from "../types";

type TaskFormData = Omit<Task, "id">;

export const getTasks = async (): Promise<Task[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...tasks];
};

export const getTask = async (id: number): Promise<Task> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error("Task not found");
  return { ...task };
};

export const addTask = async (data: TaskFormData): Promise<Task> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask: Task = { id: newId, ...data };
  tasks.push(newTask);
  return newTask;
};

export const editTask = async (task: Task): Promise<Task> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = tasks.findIndex((t) => t.id === task.id);
  if (index === -1) throw new Error("Task not found");
  tasks[index] = task;
  return task;
};

export const deleteTask = async (id: number): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");
  tasks.splice(index, 1);
  return id;
};
