import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {

    const userToken = useCookie<string | null | boolean>('isLoggedIn');
    
    if (userToken.value === true) {
      console.log("Valid token:", userToken.value);
      //  router.push("/")
      if (to.path === '/userlogin') {
        return navigateTo('/'); 
      }
      if (to.path === '/userregisteration') {
        return navigateTo('/');
      }

      if(to.path === "/forgotpass"){
        return navigateTo("/setpass")
      }

      
    }else{
      if(to.path === "/allusers"){
        return navigateTo("/");
      }
      // if(to.path === "/setpass"){
      //   return navigateTo("/forgotpass")
      // }
    }
    
    
})



  