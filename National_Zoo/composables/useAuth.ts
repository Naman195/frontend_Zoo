import { useToastNotify } from "~/composables/useToastNotify";
export function useAuth() {
  const isLoggedIn =  useState<boolean>("isLoggedIn", ()=> false);
  const userId = useState<number | null>("userId", ()=> null);
  const isAdmin = useState<boolean>("isAdmin", ()=> false);

const { showToast } = useToastNotify();

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
    const refreshToken = useCookie('refreshToken');
    loginCookie.value = "false";
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
    token.value = null
    refreshToken.value = null;

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
  
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode JWT", error);
      return null;
    }
  };
  


  const checkAndRefreshToken = async () => {
    const token = useCookie("auth").value;
    const refreshToken = useCookie("refreshToken").value;
  
    if (!token || !refreshToken) return;
  
    const decodedToken = decodeJWT(token);
    
    if (!decodedToken || !decodedToken.exp) {
      console.log("Invalid or expired token");
      showToast("Invalid or expired token", "red");
      logOut();
      return;
    }
  
    const currentTime = Math.floor(Date.now() / 1000); 
  
    if (decodedToken.exp - currentTime < 360) {
      try {
        const response = await useCustomFetch<string>("/auth/refresh", {
          method: "POST",
          body: {     "refreshtoken":  refreshToken },
        });
        
        useCookie("auth").value = response;
      } catch (error) {
        console.error("Failed to refresh token", error);
        showToast("Refresh Token Expired", "red");
        logOut();
      }
    }
  };
  
  
  return { isLoggedIn, logIn, logOut, userId, isAdmin, checkAndRefreshToken };
}
