import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Task } from "../../pages/Tasks/types";

type TaskFormData = Omit<Task, "id">;

type TaskDialogProps = {
  open: boolean;
  task: Task | null;
  onSave: (data: TaskFormData) => void;
  onClose: () => void;
};

const TaskDialog = ({ open, task, onClose, onSave }: TaskDialogProps) => {
  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "todo",
  });

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title,
              description: task.description,
              status: task.status,
            }
          : { title: "", description: "", status: "todo" }
      );
    }
  }, [open, task]);

  const isEdit = task !== null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          fullWidth
          size="small"
          margin="dense"
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          fullWidth
          size="small"
          multiline
          rows={3}
        />
        <TextField
          label="Status"
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              status: e.target.value as Task["status"],
            }))
          }
          select
          fullWidth
          size="small"
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(form)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
