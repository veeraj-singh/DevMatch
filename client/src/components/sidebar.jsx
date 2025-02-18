import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  Globe, 
  MessageCircle, 
  PlusCircle, 
  Settings, 
  ChevronsLeft, 
  ChevronsRight,
  Code,
  LogOut,
  GitBranch,
  Layers,
  Space,
  Grid,
  FolderOpen,
  Gamepad
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('idToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      text: "Dashboard", 
      route: "/dashboard" 
    },
    { 
        icon: <FolderOpen className="w-5 h-5" />, 
        text: "My Worspaces", 
        route: "/my-workspaces" 
    },
    { 
      icon: <Globe className="w-5 h-5" />, 
      text: "Explore Matches", 
      route: "/explore-matches" 
    },
    { 
      icon: <MessageCircle className="w-5 h-5" />, 
      text: "Messages", 
      route: "/messages" 
    },
    { 
        icon: <User className="w-5 h-5" />, 
        text: "Profile", 
        route: "/profile" 
    },
    { 
        icon: <Gamepad className="w-5 h-5" />, 
        text: "Wordgame", 
        route: "/wordgame" 
    },
  ];

  const DevSidebarItem = ({ icon, text, route, isActive }) => (
    <li 
      className={`
        group cursor-pointer flex items-center 
        ${isCollapsed ? 'justify-center' : 'px-4'}
        py-3 
        ${isActive 
          ? 'bg-green-500 bg-opacity-20 text-green-400' 
          : 'hover:bg-gray-700 text-gray-400'}
        transition-all duration-200
      `}
      onClick={() => navigate(route)}
    >
      {icon}
      {!isCollapsed && (
        <span className="ml-3 text-sm">
          {text}
        </span>
      )}
    </li>
  );

  return (
    <aside 
      className={`
        bg-gray-800 text-white border-r border-gray-700 
        flex flex-col 
        ${isCollapsed ? 'w-16' : 'w-64'}
        transition-all duration-300
      `}
    >
      {/* Header */}
      <div 
        className={`
          p-4 flex items-center 
          ${isCollapsed ? 'justify-center' : 'justify-between'}
          border-b border-gray-700
        `}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <Code className="w-6 h-6 text-green-400 mr-2" />
            <span className="font-bold text-lg">DevMatch</span>
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white transition"
        >
          {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <DevSidebarItem
              key={item.route}
              {...item}
              isActive={location.pathname === item.route}
            />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div 
        className={`
          border-t border-gray-700 p-4 
          ${isCollapsed ? 'flex justify-center' : ''}
        `}
      >
        <button
          onClick={handleLogout}
          className={`
            text-gray-400 hover:text-white hover:bg-gray-700 
            ${isCollapsed ? 'p-2' : 'flex items-center w-full p-3'}
            rounded transition-all
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;