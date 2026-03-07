import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import Tasks from "./Tasks";
import * as api from "./api";

jest.mock("./api");

const mockedApi = api as jest.Mocked<typeof api>;

const mockTasks = [
  {
    id: 1,
    title: "Review pull requests",
    description: "Review and approve pending PRs",
    status: "pending" as const,
  },
  {
    id: 2,
    title: "Fix login bug",
    description: "Fix email validation",
    status: "completed" as const,
  },
];

function renderTasks() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.getTasks.mockResolvedValue(mockTasks);
    mockedApi.addTask.mockImplementation(async (data) => ({
      id: 3,
      ...data,
    }));
    mockedApi.editTask.mockImplementation(async (task) => task);
    mockedApi.deleteTask.mockImplementation(async (id) => id);
  });

  describe("Task List", () => {
    it("should show the tasks list with Add task button", () => {
      renderTasks();

      expect(screen.getByText("Task list")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add task/i })
      ).toBeInTheDocument();
    });

    it("should display tasks from API in the table", async () => {
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText(mockTasks[0].title)).toBeInTheDocument();
      });

      expect(screen.getByText(mockTasks[1].title)).toBeInTheDocument();
    });

    it("calls getTasks on mount", async () => {
      renderTasks();

      await waitFor(() => {
        expect(mockedApi.getTasks).toHaveBeenCalled();
      });
    });
  });

  describe("Add Task", () => {
    it("opens Add Task dialog when Add task button is clicked", async () => {
      const user = userEvent.setup();
      renderTasks();

      await user.click(screen.getByRole("button", { name: /add task/i }));

      await waitFor(() => {
        expect(screen.getByText("Add Task")).toBeInTheDocument();
      });
    });

    it("calls addTask API when saving a new task", async () => {
      const user = userEvent.setup();
      renderTasks();

      await user.click(screen.getByRole("button", { name: /add task/i }));

      await waitFor(() => {
        expect(screen.getByText("Add Task")).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText("Title"), "New task");
      await user.type(screen.getByLabelText("Description"), "New desc");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockedApi.addTask).toHaveBeenCalledWith({
          title: "New task",
          description: "New desc",
          status: "todo",
        });
      });
    });

    it("closes dialog after saving a new task", async () => {
      const user = userEvent.setup();
      renderTasks();

      await user.click(screen.getByRole("button", { name: /add task/i }));

      await waitFor(() => {
        expect(screen.getByText("Add Task")).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText("Title"), "New task");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
      });
    });
  });

  describe("Edit Task", () => {
    it("opens Edit Task dialog with task data when edit icon is clicked", async () => {
      const user = userEvent.setup();
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText("Review pull requests")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByLabelText("Edit");
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Edit Task")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("Title")).toHaveValue(
        "Review pull requests"
      );
      expect(screen.getByLabelText("Description")).toHaveValue(
        "Review and approve pending PRs"
      );
    });

    it("calls editTask API when saving edits", async () => {
      const user = userEvent.setup();
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText("Review pull requests")).toBeInTheDocument();
      });

      const editButtons = screen.getAllByLabelText("Edit");
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Edit Task")).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText("Title");
      await user.clear(titleInput);
      await user.type(titleInput, "Updated title");
      await user.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(mockedApi.editTask).toHaveBeenCalledWith({
          id: 1,
          title: "Updated title",
          description: "Review and approve pending PRs",
          status: "pending",
        });
      });
    });
  });

  describe("Delete Task", () => {
    it("shows delete confirmation dialog when delete icon is clicked", async () => {
      const user = userEvent.setup();
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText("Review pull requests")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText("Delete");
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Are you sure you want to delete this task?")
        ).toBeInTheDocument();
      });
    });

    it("calls deleteTask API when delete is confirmed", async () => {
      const user = userEvent.setup();
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText("Review pull requests")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText("Delete");
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Delete Task")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockedApi.deleteTask).toHaveBeenCalledWith(1);
      });
    });

    it("closes confirmation dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      renderTasks();

      await waitFor(() => {
        expect(screen.getByText("Review pull requests")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText("Delete");
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Delete Task")).toBeInTheDocument();
      });

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      await waitFor(() => {
        expect(screen.queryByText("Delete Task")).not.toBeInTheDocument();
      });
    });
  });
});
