import type { Task } from "../../pages/Tasks/types";

const tasks: Task[] = [
  {
    id: 1,
    title: "Review pull requests",
    description: "Review and approve pending PRs on the dashboard repo",
    status: "pending",
  },
  {
    id: 2,
    title: "Fix login validation bug",
    description:
      "Resolve the issue where empty email passes client-side validation",
    status: "completed",
  },
  {
    id: 3,
    title: "Write unit tests for payments module",
    description:
      "Add test coverage for the createPayment and refundPayment functions",
    status: "pending",
  },
  {
    id: 4,
    title: "Update API documentation",
    description: "Document the new tenant onboarding endpoints in the wiki",
    status: "completed",
  },
  {
    id: 5,
    title: "Deploy staging environment",
    description:
      "Push the latest release candidate to the staging server for QA testing",
    status: "pending",
  },
];

export default tasks;
