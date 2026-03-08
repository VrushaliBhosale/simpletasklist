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

type FormErrors = {
  title?: string;
  description?: string;
};

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

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
      setErrors({});
      setSubmitted(false);
    }
  }, [open, task]);

  //RHF can be used for this and yup/zod for validations  
  const validate = (data: TaskFormData): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!data.description.trim()) {
      newErrors.description = "Description is required";
    }
    return newErrors;
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (submitted) {
      setErrors(validate(updated));
    }
  };

  const handleSave = () => {
    setSubmitted(true);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSave(form);
    }
  };

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
          onChange={(e) => handleChange("title", e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          size="small"
          margin="dense"
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          size="small"
          multiline
          rows={3}
        />
        <TextField
          label="Status"
          value={form.status}
          onChange={(e) =>
            handleChange("status", e.target.value)
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
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
