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

      
    }else{
      if(to.path === "/allusers"){
        return navigateTo("/");
      }
    }
    
    
})



  