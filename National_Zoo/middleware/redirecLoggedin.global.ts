import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAndRefreshToken } = useAuth();

  await checkAndRefreshToken();

  const token = useCookie("auth").value;
  const userLoggedIn = useCookie<string | null | boolean>("isLoggedIn").value;

  if (!token) {
    if (["/zoo/allzoos", "/animal/allanimals", "/animalprofile"].some((path) => to.path.startsWith(path))) {
      return navigateTo("/");
    }
  } else if (userLoggedIn) {
    if (["/userlogin", "/userregistration"].includes(to.path)) {
      return navigateTo("/");
    } else if (["/forgotpass", "/UpdatePass"].some((path) => to.path.startsWith(path))) {
      return navigateTo("/setpass");
    }
  }
});
