const isLoggedIn = ref(false);
const userId = ref(null);

export function useAuth() {
  const logIn = async (id) => {
    console.log("helooo...........")
    const loginCookie = useCookie('isLoggedIn');
    loginCookie.value = true;
    const userIdCookie = useCookie('userId');
    userIdCookie.value = id; 
    isLoggedIn.value = true; 
    userId.value = id; 
  };

  const logOut = () => {
    console.log("Hello from logout IN");
    
    const loginCookie = useCookie('isLoggedIn');
    const token = useCookie("auth");
  const userIdCookie = useCookie('userId', {
    maxAge: 0
  });
    
    loginCookie.value = false;
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
    token.value = null
  };



  return { isLoggedIn, logIn, logOut, userId };
}
