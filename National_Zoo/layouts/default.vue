<template>
    <nav class="navbar">
      <div class="navdiv">
        <div class="logo">
          <NuxtLink to="/">National - Zoo</NuxtLink>
        </div>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="#">About</NuxtLink></li>
          <li><NuxtLink to="#">Contact</NuxtLink></li>
          <template v-if="!userToken">


            <li>
              <button>
                <NuxtLink to="/userlogin">SignIn</NuxtLink>
              </button>
            </li>
            <li>
              <button>
                <NuxtLink to="/userregisteration">SignUp</NuxtLink>
              </button>
            </li>
          </template>

          <template v-else>
          <li>
            <button @click="logoutUser">LogOut</button>
          </li>
        </template>
        </ul>
        
      </div>
    </nav>
    <div>
            <slot />
        </div>
  </template>
  
  <script setup ts>
  import "../assests/css/Navbar.css"
  import { useAuth } from "~/composables/useAuth";

  const router = useRouter()

  const { isLoggedIn, logOut }  = useAuth();
  const userToken = useCookie('isLoggedIn');
  console.log("hello from navbar",userToken.value)
   

  const logoutUser = () => {
    logOut()
    router.push("/userlogin")
  }

  </script>
  
 
  