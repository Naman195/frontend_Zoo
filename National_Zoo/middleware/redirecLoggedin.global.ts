

export default defineNuxtRouteMiddleware((to, from) => {

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

        // if(to.path === "/zoo/allzoos" || to.path === "/animal/allanimals?zooId=" || to.path === "/animalprofile?id="){
        //      return navigateTo("/");
        //    }
    }
    

})





