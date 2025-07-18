import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creamos el contexto
export const AuthContext = createContext();

// Provider que envuelve la app y maneja estado de autenticación
export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al iniciar, leemos el rol guardado en AsyncStorage para persistencia
    async function loadRole() {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        if (storedRole && storedRole !== 'undefined' && storedRole !== '') {
          setRole(storedRole);
        }
      } catch (e) {
        console.error('Error cargando rol:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRole();
  }, []);

  // Función para iniciar sesión, guardar rol y actualizar estado
  const login = async (newRole) => {
    try {
      await AsyncStorage.setItem('role', newRole);
      setRole(newRole);
    } catch (e) {
      console.error('Error guardando rol:', e);
    }
  };

  // Función para cerrar sesión, borrar rol y actualizar estado
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('role');
      setRole(null);
    } catch (e) {
      console.error('Error removiendo rol:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}