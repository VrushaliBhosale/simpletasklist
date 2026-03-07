import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "../../../pages/Tasks/types";
import TaskDialog from "../TaskDialog";

const mockTask: Task = {
  id: 1,
  title: "Test task",
  description: "Test description",
  status: "pending",
};

describe("TaskDialog", () => {
  it("renders Add Task dialog with empty fields when no task is provided", () => {
    render(
      <TaskDialog
        open={true}
        task={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Add Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
  });

  it("renders Edit Task dialog with pre-filled fields when task is provided", () => {
    render(
      <TaskDialog
        open={true}
        task={mockTask}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Test task");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test description"
    );
  });

  it("calls onSave with form data when Save is clicked", async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(
      <TaskDialog open={true} task={null} onSave={onSave} onClose={jest.fn()} />
    );

    await user.type(screen.getByLabelText("Title"), "New task");
    await user.type(screen.getByLabelText("Description"), "New description");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith({
      title: "New task",
      description: "New description",
      status: "todo",
    });
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      <TaskDialog
        open={true}
        task={null}
        onSave={jest.fn()}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("calls onSave with updated data when editing an existing task", async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    render(
      <TaskDialog
        open={true}
        task={mockTask}
        onSave={onSave}
        onClose={jest.fn()}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated title");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith({
      title: "Updated title",
      description: "Test description",
      status: "pending",
    });
  });

  it("does not render when open is false", () => {
    render(
      <TaskDialog
        open={false}
        task={null}
        onSave={jest.fn()}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
  });
});
