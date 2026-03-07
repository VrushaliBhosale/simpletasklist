import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeleteConfirmationDialog = (props: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this task?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={props.onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
