import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

describe("DeleteConfirmationDialog", () => {
  it("renders confirmation message when open", () => {
    render(
      <DeleteConfirmationDialog
        open={true}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this task?")
    ).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteConfirmationDialog
        open={true}
        onConfirm={onConfirm}
        onClose={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteConfirmationDialog
        open={true}
        onConfirm={jest.fn()}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    render(
      <DeleteConfirmationDialog
        open={false}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText("Delete Task")).not.toBeInTheDocument();
  });
});
