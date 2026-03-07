import { Box, IconButton, Tooltip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { Task } from "./types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DeleteConfirmationDialog from "../../components/DeleteConfirmation/DeleteConfirmationDialog";
import TaskDialog from "../../components/TaskDialog";
import { useAddTask, useEditTask, useDeleteTask } from "../../queries";

type TaskFormData = Omit<Task, "id">;

type TableProps = {
  data: Task[];
  dialogOpen: boolean;
  handleDialog: (value: boolean) => void;
};

export default function Table({ data, dialogOpen, handleDialog }: TableProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();
  const addTask = useAddTask();
  const editTask = useEditTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (dialogOpen) {
      setEditingTask(null);
    }
  }, [dialogOpen]);

  const isDialogOpen = dialogOpen || editingTask !== null;

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      deleteTask.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleSave = (formData: TaskFormData) => {
    if (editingTask) {
      editTask.mutate({ ...editingTask, ...formData });
    } else {
      addTask.mutate(formData);
    }
    setEditingTask(null);
    handleDialog(false);
  };

  const columns: GridColDef<Task>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 300 },
    { field: "description", headerName: "Description", width: 500 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => setDeleteId(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 600 }}>
      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        onRowClick={(params, event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button") || target.closest(".MuiCheckbox-root"))
            return;
          navigate(`/task/${params.row.id}`);
        }}
        sx={{ cursor: "pointer" }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}
      />
      <TaskDialog
        open={isDialogOpen}
        task={editingTask}
        onSave={handleSave}
        onClose={() => {
          setEditingTask(null);
          handleDialog(false);
        }}
      />
      <DeleteConfirmationDialog
        open={deleteId !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
      />
    </Box>
  );
}
