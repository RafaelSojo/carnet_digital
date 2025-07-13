import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


const Header: React.FC = () => {
   const { Usuario } = useSelector((state: RootState) => state.login);
  
  return (
    <header className="bg-white shadow h-16 flex items-center px-6">
      <div className="flex-1"></div>
      <div className="flex items-center">
      <span className="text-gray-700 mr-3">{Usuario?.nombre_completo || 'Usuario'}</span>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;