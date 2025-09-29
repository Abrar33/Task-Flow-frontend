# Team Board Frontend (frontend)

This is the client-side application for the Team Board collaborative task management platform. It provides a real-time, drag-and-drop interface for managing boards, lists, and tasks.

## ✨ Features

* **Single-Page Application (SPA):** Built with React and React Router.
* **Drag & Drop (DnD):** Uses `react-dnd` to allow users to easily move tasks between lists.
* **Real-time Updates:** Utilizes **Socket.IO** to instantly sync board, task, and notification changes across all active users.
* **Context API for State Management:** Dedicated contexts for **Auth**, **Boards**, and **Notifications** to manage global state.
* **User Authentication:** Secure login and registration.
* **Board & Task CRUD:** Full functionality for creating, viewing, updating, and deleting boards, lists, and tasks.
* **Role-Based Access Control (RBAC):** UI controls and actions (like adding/deleting lists/tasks, inviting members) are restricted to **Admin** and **Member** roles.
* **Toast Notifications:** Uses `react-hot-toast` for user feedback.

## 🛠️ Technology Stack

* **Framework:** React
* **Routing:** React Router DOM
* **State Management:** React Context API + Hooks (`useState`, `useCallback`, `useEffect`, etc.)
* **Real-time:** Socket.IO Client
* **Drag & Drop:** `react-dnd` with `HTML5Backend`
* **Styling:** Tailwind CSS (*inferred from utility classes like `dark:bg-gray-900`, `flex-shrink-0`*)
* **Icons:** `react-icons`

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS version)
* The **Team Board Backend** running on a specified port (e.g., `http://localhost:3000`).

### Installation

1.  **Clone the repository (if not already done):**
    ```bash
    git clone <your-repo-url>
    cd team-board-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file** in the root directory and add your environment variables.

### Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | The URL of your running backend API. | `http://localhost:3000/api` |
| `REACT_APP_SOCKET_URL` | The base URL for the Socket.IO connection. | `http://localhost:3000` |

### Running the Application

Start the development server:

```bash
npm start
# or
yarn start