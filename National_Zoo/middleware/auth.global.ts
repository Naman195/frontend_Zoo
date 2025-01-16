import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { logOut } = useAuth();
  const isLoggedIn = useCookie<Boolean>("isLoggedIn");

  const tokenExp = ref();
  if (isLoggedIn.value) {
    const data = await $fetch("/api/user-session", {
      method: "GET",
    });

    if (data) {
      tokenExp.value = data.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpirationTime: any = data?.exp;
      const timetaken = tokenExpirationTime - 200;
      if (currentTime >= timetaken) {
        const data = await $fetch("/api/refreshJwtToken", {
          method: "POST",
        });

        if (data == "session expired") {
          navigateTo("/userlogin");
          logOut();
          return;
        }
      }
    }
  }

  if (
    isLoggedIn.value &&
    (to.path == "/userlogin" || to.path == "/userregistration")
  ) {
    return navigateTo("/");
  } else if (
    (isLoggedIn.value && to.path === "/forgotpass") ||
    to.path.startsWith("/setPassword")
  ) {
    return navigateTo("/UpdatePassword");
  } else if (
    isLoggedIn.value == false &&
    (to.path === "/zoo/allzoos" ||
      to.path.startsWith("/animal/allanimals") ||
      to.path.startsWith("/animalprofile"))
  ) {
    return navigateTo("/userlogin");
  } else {
    return;
  }
});
