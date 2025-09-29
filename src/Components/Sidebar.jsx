import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-500 m-4 rounded-2xl dark:bg-gray-600 p-4 flex flex-col items-center">
      <div className="w-full flex justify-center mb-6">
        <img src="" alt="Logo" className="w-20 h-20 rounded-full" />
      </div>
      <nav className="w-full">
        <ul>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <span className="ml-3">Inbox</span>
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <span className="ml-3">Boards</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto w-full text-center text-gray-500 dark:text-gray-400">
        © 2024 Your App
      </div>
    </div>
  );
};

export default Sidebar;