import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import TaskDetails from "../TaskDetails";
import * as api from "../../../api";

jest.mock("../../../api");

const mockedApi = api as jest.Mocked<typeof api>;

function renderTaskDetails(taskId: number) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/task/${taskId}`]}>
        <Routes>
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/" element={<div>Tasks Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("TaskDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays task details after loading", async () => {
    mockedApi.getTask.mockResolvedValue({
      id: 1,
      title: "Review pull requests",
      description: "Review and approve pending PRs",
      status: "pending",
    });

    renderTaskDetails(1);

    await waitFor(() => {
      expect(screen.getByText("Review pull requests")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Review and approve pending PRs")
    ).toBeInTheDocument();
    expect(screen.getByText("Task #1")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("displays 'Task not found.' when task does not exist", async () => {
    mockedApi.getTask.mockRejectedValue(new Error("Task not found"));

    renderTaskDetails(999);

    await waitFor(() => {
      expect(screen.getByText("Task not found.")).toBeInTheDocument();
    });
  });

  it("navigates back to tasks list when Back button is clicked", async () => {
    const user = userEvent.setup();

    mockedApi.getTask.mockResolvedValue({
      id: 1,
      title: "Test task",
      description: "Test desc",
      status: "completed",
    });

    renderTaskDetails(1);

    await waitFor(() => {
      expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /back to tasks/i }));

    await waitFor(() => {
      expect(screen.getByText("Tasks Page")).toBeInTheDocument();
    });
  });

  it("shows correct chip color for completed status", async () => {
    mockedApi.getTask.mockResolvedValue({
      id: 2,
      title: "Done task",
      description: "Finished",
      status: "completed",
    });

    renderTaskDetails(2);

    await waitFor(() => {
      expect(screen.getByText("completed")).toBeInTheDocument();
    });
  });
});
