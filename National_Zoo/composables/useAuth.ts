import { useToastNotify } from "~/composables/useToastNotify";
import type { Token } from "~/types/Token";
export function useAuth() {
  const isLoggedIn = useState<boolean>("isLoggedIn", () => false);
  const userId = useState<number | null>("userId", () => null);
  const isAdmin = useState<boolean>("isAdmin", () => false);

  const { showToast } = useToastNotify();

  const logIn = async (id: number | null) => {
    const loginCookie = useCookie("isLoggedIn");
    loginCookie.value = "true";
    const userIdCookie = useCookie("userId");
    userIdCookie.value = String(id);
    isLoggedIn.value = true;
    userId.value = id;
  };

  const logOut = () => {
    const loginCookie = useCookie("isLoggedIn");
    const token = useCookie("auth");
    const userIdCookie = useCookie("userId", {
      maxAge: 0,
    });
    const refreshToken = useCookie("refreshToken");
    loginCookie.value = "false";
    userIdCookie.value = null;
    isLoggedIn.value = false;
    userId.value = null;
    token.value = null;
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
  
    if (!refreshToken) {
      console.log("No refresh token available. Logging out.");
      showToast("Session expired. Please log in again.", "red");
      logOut();
      return;
    }
  
    try {
      if (token) {
        const decodedToken = decodeJWT(token);
        const currentTime = Math.floor(Date.now() / 1000);
  
        // Check if the JWT is about to expire
        if (decodedToken && decodedToken.exp && currentTime >= decodedToken.exp - 360) {
          const response = await useCustomFetch<Token>("/auth/refresh", {
            method: "POST",
            body: { refreshtoken: refreshToken },
          });
  
          // Set new JWT and refreshToken in cookies
          useCookie("auth").value = response.jwt;
          useCookie("refreshToken").value = response.refreshToken;
          showToast("Token refreshed successfully.", "green");
        }
      } else {
        console.log("JWT expired. Attempting refresh.");
        const response = await useCustomFetch<Token>("/auth/refresh", {
          method: "POST",
          body: { refreshtoken: refreshToken },
        });
  
        // Set new JWT and refreshToken in cookies
        useCookie("auth").value = response.jwt;
        useCookie("refreshToken").value = response.refreshToken;
        showToast("Token refreshed successfully.", "green");
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
      showToast("Session expired. Please log in again.", "red");
      logOut();
    }
  };
  

  return { isLoggedIn, logIn, logOut, userId, isAdmin, checkAndRefreshToken };
}
