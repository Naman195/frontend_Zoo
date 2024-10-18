// // composables/useAuth.js
// const isLoggedIn = ref(false);
// const userId = ref(null);

// export   function useAuth ()  {
//   const logIn = async (id) => {
//     // isLoggedIn.value =  true;
//     // userId.value = id;
//     const nn = useCookie('isLoggedIn')
//     nn.value = true;
//     const userId = useCookie('userId')
//     userId.value = id;
//     // localStorage.setItem('isLoggedIn', 'true');
//     // localStorage.setItem('userId', id);
//   };

//   const logOut = () => {
//     isLoggedIn.value = false;
//     userId.value = null;
//     // localStorage.removeItem('isLoggedIn');
//     // localStorage.removeItem('userId');
    

//   };

//   // Restore login state on app load
//   onMounted(() => {
//     const storedLoginStatus = useCookie("nn")
//     const storedUserId = useCookie("id");

//     if (storedLoginStatus !== null && storedUserId !== null) {
//         if (storedLoginStatus === 'true'  && storedUserId) {
//             isLoggedIn.value = true;
//             userId.value = storedUserId;
//             console.log("On mounted IN", isLoggedIn);

//         }}
//   });
//   console.log("On mounted Out", isLoggedIn);

//   return { isLoggedIn, logIn, logOut, userId };
// }


// composables/useAuth.js


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
    const loginCookie = useCookie('isLoggedIn');
    const userIdCookie = useCookie('userId');
    
    loginCookie.value = false;
    userIdCookie.value = null; 
    isLoggedIn.value = false; 
    userId.value = null;
  };

  
  onMounted(() => {
    const storedLoginStatus = useCookie('isLoggedIn').value; 
    const storedUserId = useCookie('userId').value;
    
    if (storedLoginStatus === 'true' && storedUserId) {
      isLoggedIn.value = true;
      userId.value = storedUserId; 
      console.log("On mounted IN", isLoggedIn);
    }
  });

  console.log("On mounted Out", isLoggedIn.value);

  return { isLoggedIn, logIn, logOut, userId };
}
