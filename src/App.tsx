import "./App.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Tasks />,
  },
  {
    path: "/task/:id",
    element: <TaskDetails />,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
