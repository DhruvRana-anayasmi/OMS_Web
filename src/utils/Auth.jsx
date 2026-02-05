export const isAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("tokenExpiry");
  
  if (!token || !expiry) return false;
  
  // Check if token is expired
  if (Date.now() > parseInt(expiry)) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    return false;
  }
  
  return true;
};

export const setAuthSession = (token) => {
  const expiryTime = Date.now() + (1 * 60 * 60 * 1000); // 1 hour from now
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("tokenExpiry", expiryTime.toString());
};

export const getToken = () => {
  if (!isAuthenticated()) {
    return null;
  }
  return sessionStorage.getItem("token");
};