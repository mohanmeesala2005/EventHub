export const getTokenFromStorage = () => localStorage.getItem("token") || null;

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

export const isAuthenticated = () => Boolean(getTokenFromStorage());

export const isAdminUser = () => {
  const user = getUserFromStorage();
  return user?.role === "admin";
};
