export const getTokenFromStorage = () => localStorage.getItem("token") || null;

export const saveAuthInStorage = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

export const getCurrentUser = () => getUserFromStorage();

export const isAuthenticated = () => Boolean(getTokenFromStorage());

export const isAdminUser = () => {
  const user = getUserFromStorage();
  return user?.role === "admin";
};
