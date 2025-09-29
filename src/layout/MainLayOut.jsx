// layouts/MainLayout.jsx
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex flex-3 overflow-hidden">
        {/* <Sidebar /> */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
