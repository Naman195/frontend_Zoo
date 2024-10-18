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
          <template v-if = "!userToken">
            
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
          <!-- <li>
            <button @click="logoutUser">LogOut</button>
          </li> -->
          <li  class="profile-icon" @click="toggleProfile">
            <img  src="../assests/images/user.png" alt="Image Profile" height="35" />
          </li>
        </template>


        </ul>
        
      </div>
      <!-- Popup Profile Box -->
    <div v-if="isProfileVisible" class="profile-popup">
      <h2>User Profile</h2>

      <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
      <p><strong>City:</strong> {{ user.address.city.cityName }}</p>
      <!-- <p>User Data is not Availale</p> -->
      <button @click="logoutUser">Logout</button>
    </div>
    </nav>
    <div>
            <slot />
        </div>
  </template>
  
  <script setup>
  import "../assests/css/Navbar.css"
  import { useAuth } from "~/composables/useAuth";



  const router = useRouter()

  const { isLoggedIn, logOut }  = useAuth();
  const userToken = useCookie('isLoggedIn');
  // console.log("hello from navbar",userToken.value)
   const isProfileVisible = ref(false);

  const logoutUser = () => {
    console.log("Hello efore Logout");
    logOut()
    console.log("Hello After Logout");
    
    router.push("/userlogin")
    isProfileVisible.value = false;

  }

  const toggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value;
};


//Api Call for User Profile

const user = ref(null);
const userId = useCookie('userId');

const fetchProfile = async () => {
    try {
      const fetchedUser = await $fetch(`http://localhost:8080/api/zoo/users/${userId.value}`)
      user.value = fetchedUser;
      console.log(user.value);
      
      
    } catch (error) {
      console.error('Error fetching User:', error);
    }
}

onBeforeMount(()=>{
  fetchProfile()
})

  </script>
