

export default defineNuxtRouteMiddleware((to, from) => {

  const token = useCookie("auth")
const userId =   useCookie("userId")
const userLoggedIn = useCookie<string | null | boolean>('isLoggedIn');

if(token.value){


    
        if (userLoggedIn.value === true) {
         
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
          
        }

    }else{
        userLoggedIn.value = false;
        userId.value = null;
        // return navigateTo("/userlogin");
    }
    

})





