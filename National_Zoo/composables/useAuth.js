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
  const userIdCookie = useCookie('userId', {
    maxAge: 0
  });
    
    loginCookie.value = false;
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
  };

  
  // onMounted(() => {
  //   const storedLoginStatus = useCookie('isLoggedIn').value; 
  //   const storedUserId = useCookie('userId').value;
    
  //   if (storedLoginStatus === 'true' && storedUserId) {
  //     isLoggedIn.value = true;
  //     userId.value = storedUserId; 
  //     console.log("On mounted IN", isLoggedIn);
  //   }
  // });

  // console.log("On mounted Out", isLoggedIn.value);

  return { isLoggedIn, logIn, logOut, userId };
}
