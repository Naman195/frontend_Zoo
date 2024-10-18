import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(to => {
  const router = useRouter()
  
    const { isLoggedIn } = useAuth();

    
     
    const userToken = useCookie<string | null | boolean>('isLoggedIn');
    
    if (userToken.value === true) {
      console.log("Valid token:", userToken.value);
       router.push("/")
    }
    
})



  