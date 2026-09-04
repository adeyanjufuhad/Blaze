import { create } from 'zustand';
import { User } from '../types';
import { joinUserRoom, joinAdminRoom } from '../lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  adminToken: string | null;
  adminUser: User | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: User) => void;
  adminLogin: (adminToken: string, admin: User) => void;
  logout: () => void;
  adminLogout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Read initial values from localStorage
  const storedUser = localStorage.getItem('blaze_user');
  const storedToken = localStorage.getItem('blaze_token');
  const storedRefreshToken = localStorage.getItem('blaze_refresh_token');
  const storedAdminToken = localStorage.getItem('blaze_admin_token');
  const storedAdminUser = localStorage.getItem('blaze_admin_user');

  let initialUser: User | null = null;
  let initialAdminUser: User | null = null;

  try {
    if (storedUser) initialUser = JSON.parse(storedUser);
    if (storedAdminUser) initialAdminUser = JSON.parse(storedAdminUser);
  } catch (e) {
    console.error('Failed to parse auth from localStorage', e);
  }

  // Join socket rooms if user/admin is logged in
  if (initialUser && (initialUser.id || initialUser._id)) {
    joinUserRoom(initialUser.id || initialUser._id!);
  }
  if (storedAdminToken) {
    joinAdminRoom();
  }

  return {
    user: initialUser,
    token: storedToken,
    refreshToken: storedRefreshToken,
    adminToken: storedAdminToken,
    adminUser: initialAdminUser,
    isAuthenticated: Boolean(storedToken && initialUser),
    isAdminAuthenticated: Boolean(storedAdminToken),

    login: (token, refreshToken, user) => {
      localStorage.setItem('blaze_token', token);
      localStorage.setItem('blaze_refresh_token', refreshToken);
      localStorage.setItem('blaze_user', JSON.stringify(user));

      set({
        token,
        refreshToken,
        user,
        isAuthenticated: true,
      });

      const uid = user.id || user._id;
      if (uid) {
        joinUserRoom(uid);
      }
    },

    adminLogin: (adminToken, admin) => {
      localStorage.setItem('blaze_admin_token', adminToken);
      localStorage.setItem('blaze_admin_user', JSON.stringify(admin));

      set({
        adminToken,
        adminUser: admin,
        isAdminAuthenticated: true,
      });

      joinAdminRoom();
    },

    logout: () => {
      localStorage.removeItem('blaze_token');
      localStorage.removeItem('blaze_refresh_token');
      localStorage.removeItem('blaze_user');

      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },

    adminLogout: () => {
      localStorage.removeItem('blaze_admin_token');
      localStorage.removeItem('blaze_admin_user');

      set({
        adminToken: null,
        adminUser: null,
        isAdminAuthenticated: false,
      });
    },

    updateUser: (updatedFields) => {
      set((state) => {
        if (!state.user) return state;
        const newUser = { ...state.user, ...updatedFields };
        localStorage.setItem('blaze_user', JSON.stringify(newUser));
        return { user: newUser };
      });
    },
  };
});
