// layouts/MainLayout.jsx
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

const MainLayout = ({ children, darkMode, setDarkMode }) => {
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-100";
  const mainBg = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";

  return (
    <div className={`flex flex-col h-screen ${bgColor} transition-colors duration-300`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        {/* <Sidebar darkMode={darkMode} /> */}
        <main
          className={`flex-1 p- overflow-auto ${mainBg} ${textColor} transition-all duration-300 rounded-tl-xl`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;