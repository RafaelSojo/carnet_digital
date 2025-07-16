import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../../redux/slices/loginSlice';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const menuItems = [
    {
      to: "/dashboard",
      label: "Inicio",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      label: "Usuarios",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      children: [
        {
          to: "/CambiarEstado",
          label: "Cambiar Estado",
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        },
      ]
    },
  ];

  // Mantener abierto el submenú si algún hijo está activo
  useEffect(() => {
    const newOpenMenus: { [key: number]: boolean } = {};
    
    menuItems.forEach((item, index) => {
      if (item.children && isChildActive(item.children)) {
        newOpenMenus[index] = true;
      }
    });
    
    setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
  }, [location.pathname]);

  const toggleMenu = (index: number) => {
    setOpenMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    location.pathname = "/login";
  };

  type ChildMenuItem = {
    to: string;
    label: string;
    icon: string;
  };

  const isChildActive = (children: ChildMenuItem[]) => {
    return children.some(child => location.pathname === child.to);
  };
 
  return (
    <div className="bg-gray-900 text-white h-full flex flex-col w-64">
      <div className="px-4 py-6 flex items-center">
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="ml-2 text-lg font-bold">Carnet Digital</span> 
      </div>

      <div className="mt-6 flex-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.children ? (
              // Elemento con submenú
              <div>
                <div
                  onClick={() => toggleMenu(index)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                    isChildActive(item.children)
                      ? "bg-blue-800 text-white"
                      : "text-blue-100 hover:bg-blue-600"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                    <span className="ml-3">{item.label}</span>
                  </div>
                  <svg
                    className={`h-4 w-4 transform transition-transform ${
                      openMenus[index] ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                
                {openMenus[index] && (
                  <div className="bg-gray-800">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.to}
                        className={`flex items-center px-8 py-2 border-l-4 ${
                          location.pathname === child.to
                            ? "border-blue-400 bg-blue-900 text-white"
                            : "border-transparent text-blue-200 hover:bg-blue-700 hover:border-blue-300"
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={child.icon}
                          />
                        </svg>
                        <span className="ml-3 text-sm">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Elemento normal sin submenú
              <Link
                to={item.to}
                className={`flex items-center px-4 py-3 ${
                  location.pathname === item.to
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-600"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="ml-3">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center text-blue-100 hover:text-white w-full"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="ml-3">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;