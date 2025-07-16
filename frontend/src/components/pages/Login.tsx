import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/loginSlice';
import { login } from '../../api/loginApi';
import Button from '../common/Button';
import axios from 'axios';
import api from "../../api/axios";
import { AppDispatch, RootState } from '../../redux/store';
import { obtenerUsuarioPorId } from '../../api/usuarioApi';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, errorType } = useSelector((state: RootState) => state.login);
  const state = location.state as { message?: string; fromLogout?: boolean } | null;

  useEffect(() => {
    if (state?.message && !state?.fromLogout) {
      Swal.fire({
        icon: 'info',
        html: `<strong>${state.message}</strong>`,
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate(location.pathname, { replace: true });
      });
    }
  }, [state, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      dispatch(
        loginFailure({
          message: 'Usuario y/o contraseña incorrectos',
          errorType: 'authError',
        })
      );

      if (!username) {
        usernameRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    dispatch(loginStart());

    try {
      const {
        access_token,
        refresh_token,
        usuarioID,
        expires_in
      } = await login(username, password);

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      const userData = await obtenerUsuarioPorId(usuarioID);
      const nombre_completo = userData?.nombre_completo || username;

      const formattedUserData = {
        Usuario: username,
        access_token,
        refresh_token,
        usuarioID,
        expires_in,
        nombre_completo,
      };

      dispatch(loginSuccess(formattedUserData));
      localStorage.setItem("usuario", JSON.stringify(formattedUserData));

      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error al realizar login:', error);

      let errorMsg = 'Usuario y/o contraseña incorrectos';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMsg = String(error.response.data.message);
      }

      dispatch(
        loginFailure({
          message: errorMsg,
          errorType: 'authError',
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo_carnet.jpg"
            alt="Logo Los 4 mares"
            className="w-70 h-50"
          />
        </div>
        <div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && errorType === 'authError' && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-center text-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  ref={usernameRef}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) dispatch(loginFailure({ message: '', errorType: '' }));
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(loginFailure({ message: '', errorType: '' }));
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : 'Aceptar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
