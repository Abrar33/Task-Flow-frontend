// frontend/src/App.js

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Add Navigate
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthProvider } from "./context/authContext";
import { BoardProvider } from "./context/boardContext";
import BoardPage from "./pages/boardPage";
import LoginPage from "./Components/Login";
import SignupPage from "./Components/Signup";
import PrivateRoute from "./Components/PrivateRoutes";
import MainLayout from "./layout/MainLayOut";
// import InvitePage from "./pages/invitePage";
// import AcceptInvitePage from "./pages/invitePage";
import InvitePage from "./pages/invitePage";
import { NotificationProvider } from "./context/notificationsContext";
import NotificationCenter from "./pages/notificationCenter";
import AllBoards from "./Components/Board";
import { SocketProvider } from "./context/socketContext";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
              <Toaster position="top-right" reverseOrder={false} />
    
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
        <BoardProvider>
            <DndProvider backend={HTML5Backend}>
              <Routes>
                {/* 🔓 Public Routes without layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 🔐 Protected Routes inside layout */}
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                        {/* Redirect to the boards page */}
                        <NotificationCenter darkMode={darkMode}/>
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                        {/* Redirect to the boards page */}
                      <AllBoards darkMode={darkMode}/>
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                {/* Route for a specific board */}
                <Route
                  path="/boards/:boardId"
                  element={
                    <PrivateRoute>
                      <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                        <BoardPage  darkMode={darkMode}/>
                      </MainLayout >
                    </PrivateRoute>
                  }
                />
                {/* Route for the main boards page (no specific board selected) */}
                <Route
                  path="/boards"
                  element={
                    <PrivateRoute>
                      <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                        <BoardPage />
                      </MainLayout>
                    </PrivateRoute>
                  }
                />
                <Route path="/invite/accept" element={<InvitePage />} />
              </Routes>
            </DndProvider>
        </BoardProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
    </>
  );
};

export default App;
