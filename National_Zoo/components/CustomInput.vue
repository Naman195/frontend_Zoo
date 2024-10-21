<template>
  <div>
    <div class="form-group">
        <label >{{ label }}</label>
        <input :type="type" :placeholder="placeholder"  />
      </div>  
      
  </div>
</template>

<script  setup>
const emit=defineEmits(['success','fail'])
const props=defineProps({
    label:String,
    placeholder:String,
    type:String
})

</script>

 


<!-- ....................................... -->


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
    <button @click="logoutUser">Update Profile</button>
  </div>
    <div v-if="isUpdateModalVisible" class="modal">
      <div class="modal-content">
        <h2>Update Profile</h2>

        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" v-model="form.firstName" required />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" v-model="form.lastName" required />
          </div>

          <div class="form-group">
            <label for="street">Street</label>
            <input type="text" v-model="form.address.street" required />
          </div>

          <div class="form-group">
            <label for="zipCode">Zip Code</label>
            <input type="text" v-model="form.address.zipCode" required />
          </div>

          <div class="form-group">
            <label for="city">City</label>
            <select v-model="form.address.city.cityId" required>
              <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                {{ city.cityName }}
              </option>
            </select>
          </div>

          <button type="submit" class="submit-btn">Update</button>
          <button @click="closeUpdateModal" class="cancel-btn">Cancel</button>
        </form>
      </div>
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
 const isUpdateModalVisible = ref(false);

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

const form = reactive({
firstName: '',
lastName: '',
address: {
  street: '',
  zipCode: '',
  city: {
    cityId: null
  }
}
});



const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);

const fetchProfile = async () => {
  try {
    const fetchedUser = await $fetch(`http://localhost:8080/api/zoo/users/${userId.value}`)
    user.value = fetchedUser;
    
    // Pre-fill form fields with user data
  form.firstName = user.value.firstName;
  form.lastName = user.value.lastName;
  form.address.street = user.value.address.street;
  form.address.zipCode = user.value.address.zipCode;
  form.address.city.cityId = user.value.address.city.cityId;
    
    
  } catch (error) {
    console.error('Error fetching User:', error);
  }
}

const fetchCities = async () => {
try {
  const data = await $fetch(`http://localhost:8080/api/zoo/cities/${selectedState.value}`);
  cities.value = data;
} catch (error) {
  console.error('Error fetching cities:', error);
}
};

const openUpdateModal = () => {
isUpdateModalVisible.value = true;
};

const closeUpdateModal = () => {
isUpdateModalVisible.value = false;
};


onBeforeMount(()=>{

if(userToken.value == true){

  fetchProfile()
}
})

</script>
