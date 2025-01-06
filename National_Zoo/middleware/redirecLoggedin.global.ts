
// import { checkAndRefreshToken } from '../composables/useAuth';

import { useAuth } from "../composables/useAuth";
export default defineNuxtRouteMiddleware(async(to, from) => {
  const { checkAndRefreshToken } = useAuth();


  await checkAndRefreshToken();
  const token = useCookie("auth")
const userId =   useCookie("userId")
const userCookie = useCookie('user')
const userLoggedIn = useCookie<string | null | boolean>('isLoggedIn');

if(token.value){


    
        if (userLoggedIn.value === true && to.path === '/userlogin' || to.path === '/userregisteration') {
          return navigateTo('/'); 
        }
        else if(userLoggedIn.value === true && to.path === "/forgotpass"){
          return navigateTo("/setpass")
        }
        else{
          return
          // if(to.path === "/zoo/allzoos" || to.path === "/zoo/allzoos"){
          //   return navigateTo("/");
          // }

        
        }

    }else{
        userLoggedIn.value = false;
        userId.value = null;
        userCookie.value = null;

        if (to.path === "/zoo/allzoos" || to.path.startsWith("/animal/allanimals") || to.path.startsWith("/animalprofile")) {
          return navigateTo("/");
        }

    }
    

})





