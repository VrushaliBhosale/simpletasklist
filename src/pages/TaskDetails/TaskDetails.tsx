import { Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import { useTask } from "../../queries";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(Number(id));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return <Typography sx={{ mt: 4 }}>Task not found.</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Back to tasks
      </Button>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 3,
          boxShadow: 1,
        }}
      >
        <Typography variant="overline" color="text.secondary">
          Task #{task.id}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
          {task.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {task.description}
        </Typography>
        <Chip
          label={task.status}
          color={
            task.status === "completed"
              ? "success"
              : task.status === "pending"
              ? "warning"
              : "default"
          }
        />
      </Box>
    </Box>
  );
}
