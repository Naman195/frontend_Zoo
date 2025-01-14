import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { validatejwtToken } = useAuth();
  const isLoggedIn = useCookie("isLoggedIn");
  // const userId = useCookie("userId");
  // const userCookie = useCookie("user");
  // const userLoggedIn = useCookie<string | null | boolean>("isLoggedIn");

  const tokenExp = ref();
  if (isLoggedIn.value) {
    const data = await $fetch("/api/user-session", {
      method: "GET",
    });

    // const session = useCookie("h3");

    if (data) {
      tokenExp.value = data.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpirationTime: any = data?.exp;
      const timetaken = tokenExpirationTime - 200;
      if (currentTime >= timetaken) {
        console.log("not expired");

        await $fetch("/api/refreshJwtToken", {
          method: "POST",
        });
        return;
      }
    }
  }
  // if (token.value) {
  //   return await validatejwtToken();
  // }

  // if (
  //   token.value &&
  //   (to.path == "/userlogin" || to.path == "/userregisteration")
  // ) {
  //   return navigateTo("/");
  // } else if (
  //   (token.value && to.path === "/forgotpass") ||
  //   to.path.startsWith("/UpdatePass")
  // ) {
  //   return navigateTo("/setpass");
  // } else if (
  //   (!token.value && to.path === "/zoo/allzoos") ||
  //   to.path.startsWith("/animal/allanimals") ||
  //   to.path.startsWith("/animalprofile")
  // ) {
  //   return navigateTo("/userlogin");
  // } else {
  // }
});
