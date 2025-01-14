// import { useToastNotify } from "~/composables/useToastNotify";
import { jwtDecode } from "jwt-decode";
export function useAuth() {
  const isLoggedIn = useState<boolean>("isLoggedIn", () => false);
  const userId = useState<number | null>("userId", () => null);
  const isAdmin = useState<boolean>("isAdmin", () => false);

  // const { showToast } = useToastNotify();

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

    const userIdCookie = useCookie("userId");

    loginCookie.value = "false";
    userIdCookie.value = null;
    isLoggedIn.value = false;
    userId.value = null;
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

  const validatejwtToken = async () => {
    const token = useCookie("auth").value;
    const refreshToken = useCookie("refreshToken").value;
    if (token) {
      const decodeToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpirationTime: any = decodeToken.exp;

      const timetaken = tokenExpirationTime - 300;

      const tokenValidationCheck = async () => {
        try {
          const response = await $fetch<string>(
            "http://localhost:8080/auth/refresh",
            {
              method: "POST",
              body: { refreshtoken: refreshToken },
            }
          );

          useCookie("auth").value = response;
        } catch (error) {
          console.error("Failed to refresh token", error);
          // showToast("Refresh Token Expired", "red");
          // logOut();
        }
      };
      if (currentTime >= timetaken) {
        await tokenValidationCheck();
        return;
      }
    }
  };

  return { isLoggedIn, logIn, logOut, userId, isAdmin, validatejwtToken };
}
