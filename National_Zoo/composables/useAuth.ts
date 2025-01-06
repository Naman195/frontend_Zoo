export function useAuth() {
  const isLoggedIn =  useState<boolean>("isLoggedIn", ()=> false);
  const userId = useState<number | null>("userId", ()=> null);
  const isAdmin = useState<boolean>("isAdmin", ()=> false);

  const logIn = async (id: number | null) => {
    const loginCookie = useCookie('isLoggedIn');
    loginCookie.value = "true";
    const userIdCookie = useCookie('userId');
    userIdCookie.value = String(id); 
    isLoggedIn.value = true; 
    userId.value = id; 
  };

  const logOut = () => {
    
    const loginCookie = useCookie('isLoggedIn');
    const token = useCookie("auth");
  const userIdCookie = useCookie('userId', {
    maxAge: 0
  });
    
    loginCookie.value = "false";
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
    token.value = null
  };

  const decodeJWT = (token: string | undefined) => {
    if (!token) return null;
  
    try {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      if (decodedPayload.role === "admin") {
        isAdmin.value = true;
      } else {
        isAdmin.value = false;
      }
  
      return decodedPayload; // Ensure the decoded payload is returned
    } catch (error) {
      console.error("Failed to decode JWT", error);
      return null;
    }
  };
  

  // composables/useAuth.js
  const checkAndRefreshToken = async () => {
    const token = useCookie("auth").value;
    const refreshToken = useCookie("refreshToken").value;
  
    if (!token || !refreshToken) return;
  
    const decodedToken = decodeJWT(token);
  
    if (!decodedToken || !decodedToken.exp) {
      console.warn("Invalid or expired token");
      logOut();
      return;
    }
  
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
    // Check if the token is about to expire in the next 5 minutes
    if (decodedToken.exp - currentTime < 300) {
      try {
        const response = await useCustomFetch<string>("/auth/refresh", {
          method: "POST",
          body: { refreshToken },
        });
        useCookie("auth").value = response;
      } catch (error) {
        console.error("Failed to refresh token", error);
        logOut();
      }
    }
  };
  
  
  return { isLoggedIn, logIn, logOut, userId, isAdmin, checkAndRefreshToken };
}
