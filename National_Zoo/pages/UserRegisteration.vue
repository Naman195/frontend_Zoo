<template>
  <div class="register-container">
    <h1>User Registration Page</h1>

    <form @submit.prevent="registerUser" class="register-form">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input type="text" v-model="form.firstName" required />
      </div>
     <!-- <CustomInput  label="First Name" type="text" placeholder="Enter name" @success="abc" />
     <CustomInput  label="last Name" type="text" placeholder="Enter last name" @fail="bcd" />
     <CustomInput  label="username" type="text" placeholder="Enter username" /> -->

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input type="text" v-model="form.lastName" required />
      </div>

      <div class="form-group">
        <label for="userName">Username</label>
        <input type="text" v-model="form.userName" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="form.password" minlength="8" required />
      </div>

      <div class="form-group">
        <label for="country">Country</label>
        <select v-model="selectedCountry" @change="handleCountryChange" required >
          <!-- <option value="null">Select Country</option> -->
          <option v-for="country in countries" :key="country.countryId" :value="country.countryId">
            {{ country.countryName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="state">State</label>
        <select v-model="selectedState" :disabled="!selectedCountry" @change="handleStateChange"  required >
          <!-- <option value="null">Select State</option> -->
          <option v-for="state in states" :key="state.stateId" :value="state.stateId">
            {{ state.stateName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="city">City</label>
        <select v-model="form.address.city.cityId" :disabled="!selectedState" required >
          <!-- <option value="null">Select City</option> -->
          <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
            {{ city.cityName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="street">Street</label>
        <input type="text" v-model="form.address.street" required />
      </div>

      <div class="form-group">
        <label for="zipCode">Zip Code</label>
        <input type="text" v-model="form.address.zipCode" required />
      </div>

      <button type="submit" class="submit-btn">Register</button>
    </form>
  </div>
</template>

<script setup>
import '../assests/css/style.css'
// import CustomInput from '~/components/CustomInput.vue';

const userToken = useCookie('isLoggedIn');
  const router = useRouter()
  const countries = ref([])
  const states = ref([])
  const cities = ref([])
  const selectedCountry = ref(null)
  const selectedState = ref(null)

  const form = reactive({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    address: {
      street: '',
      zipCode: '',
      city: {
        cityId: null
      }
    }
  })

  const fetchCountries = async () => {
    try {
      const data = await $fetch(`http://localhost:8080/api/zoo/countries`)
      countries.value = data
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const handleCountryChange = () => {
    if (selectedCountry) {
      fetchStates()
    }
  }

  const fetchStates = async () => {
    if (!selectedCountry) return
    try {
      const data = await $fetch(`http://localhost:8080/api/zoo/state/${selectedCountry.value}`)
      states.value = data
    } catch (error) {
      console.error('Error fetching States:', error)
    }
  }

  const handleStateChange = () => {
    if (selectedState) {
      fetchCities()
    }
  }

  const fetchCities = async () => {
    try {
      const data = await $fetch(`http://localhost:8080/api/zoo/cities/${selectedState.value}`)
      cities.value = data
    } catch (error) {
      console.error('Error fetching Cities:', error)
    }
  }

  const registerUser = async () => {
    try {
      const data = await $fetch('http://localhost:8080/api/zoo/create', {
        method: 'POST',
        body: form
      })
      if (data === "User SuccessFully Created") {
      
      form.firstName = '';
      form.lastName = '';
      form.userName = '';
      form.password = '';
      form.address.street = '';  
      form.address.zipCode = ''; 
      form.address.city.cityId = null;
      
    
      selectedCountry.value = null;
      selectedState.value = null;
      cities.value = [];
      states.value = [];

      alert('User registered successfully!');
      router.push("/userlogin")
    } else {
      alert('Error: ' + data);
    }
    } catch (err) {
      console.error('An error occurred during registration:', err)
    }
  }

  // const abc=()=>{
  //   console.log("abc...")
  // }
  // const bcd=()=>{
  //   console.log("fail....")
  // }

  onBeforeMount(() => {
    fetchCountries()
  })
</script>
