import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Table from "./Table";
import { useState } from "react";
import { useTasks } from "./queries";

export default function Tasks() {
  const { data } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialog = (value: boolean) => {
    setDialogOpen(value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <h3>Task list</h3>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialog(true)}
        >
          Add task
        </Button>
      </Box>
      <Table
        data={data ?? []}
        dialogOpen={dialogOpen}
        handleDialog={handleDialog}
      />
    </Box>
  );
}
