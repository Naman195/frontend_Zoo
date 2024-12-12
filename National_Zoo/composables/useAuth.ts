export function useAuth() {
  const isLoggedIn =  useState<boolean>("isLoggedIn", ()=> false);
  const userId = useState<number | null>("userId", ()=> null);
  const isAdmin = useState<boolean>("isAdmin", ()=> false);

  const logIn = async (id: number | null) => {
    const loginCookie = useCookie('isLoggedIn');
    loginCookie.value = "true";
    const userIdCookie = useCookie('userId');
    userIdCookie.value = String(id); 
    isLoggedIn.value = true; 
    userId.value = id; 
  };

  const logOut = () => {
    
    const loginCookie = useCookie('isLoggedIn');
    const token = useCookie("auth");
  const userIdCookie = useCookie('userId', {
    maxAge: 0
  });
    
    loginCookie.value = "false";
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
    token.value = null
  };

  const decodeJWT = (token: string | undefined) => {
   
    if (!token) return null;
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
  
    if(decodedPayload.role === "admin")
       isAdmin.value = true
     isAdmin.value=false
  };
  
  return { isLoggedIn, logIn, logOut, userId, isAdmin };
}
