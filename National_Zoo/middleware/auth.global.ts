import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { validatejwtToken } = useAuth();
  const token = useCookie("auth");
  const userId = useCookie("userId");
  const userCookie = useCookie("user");
  const userLoggedIn = useCookie<string | null | boolean>("isLoggedIn");

  if (token.value) {
    return await validatejwtToken();
  }

  if (
    token.value &&
    (to.path == "/userlogin" || to.path == "/userregisteration")
  ) {
    return navigateTo("/");
  } else if (
    (token.value && to.path === "/forgotpass") ||
    to.path.startsWith("/UpdatePass")
  ) {
    return navigateTo("/setpass");
  } else if (
    (!token.value && to.path === "/zoo/allzoos") ||
    to.path.startsWith("/animal/allanimals") ||
    to.path.startsWith("/animalprofile")
  ) {
    return navigateTo("/userlogin");
  } else {
  }
});
