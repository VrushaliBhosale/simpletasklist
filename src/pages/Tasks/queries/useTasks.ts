import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "../../../keys";
import { addTask, deleteTask, editTask, getTask, getTasks } from "../api";
import type { Task } from "../types";

type TaskFormData = Omit<Task, "id">;

export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: () => getTasks(),
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: taskKeys.detail(String(id)),
    queryFn: () => getTask(id),
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskFormData) => addTask(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

export const useEditTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Task) => editTask(task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
};
