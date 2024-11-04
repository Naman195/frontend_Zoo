<template>
  <div v-if="registeredAlert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="'User Registered Successfully'"
      @close-modal="registerAlertClose"
    />
  </div>
  <div class="register-container">
    <h1>User Registration Page</h1>

    <form @submit.prevent="registerUser" class="register-form">
      <div class="register-pair">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" v-model="form.firstName" required />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" v-model="form.lastName" required />
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="userName">Username</label>
          <input type="text" v-model="form.userName" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-container">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="form.password"
              minlength="8"
              required
            />
            <span class="eye-icon" @click="togglePasswordVisibility">
              <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </span>
          </div>
          <!-- <input type="password" v-model="form.password" minlength="8" required /> -->
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="country">Country</label>
          <select
            v-model="selectedCountry"
            @change="handleCountryChange"
            required
          >
            <!-- <option value="null">Select Country</option> -->
            <option
              v-for="country in countries"
              :key="country.countryId"
              :value="country.countryId"
            >
              {{ country.countryName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="state">State</label>
          <select
            v-model="selectedState"
            :disabled="!selectedCountry"
            @change="handleStateChange"
            required
          >
            <!-- <option value="null">Select State</option> -->
            <option
              v-for="state in states"
              :key="state.stateId"
              :value="state.stateId"
            >
              {{ state.stateName }}
            </option>
          </select>
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="city">City</label>
          <select
            v-model="form.address.city.cityId"
            :disabled="!selectedState"
            required
          >
            <!-- <option value="null">Select City</option> -->
            <option
              v-for="city in cities"
              :key="city.cityId"
              :value="city.cityId"
            >
              {{ city.cityName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select v-model="form.role" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="street">Street</label>
          <input type="text" v-model="form.address.street" required />
        </div>

        <div class="form-group">
          <label for="zipCode">Zip Code</label>
          <input type="text" v-model="form.address.zipCode" required />
        </div>
      </div>

      <button type="submit" class="submit-btn">Register</button>
    </form>
  </div>
</template>

<script setup>
import "../assests/css/style.css";
// import CustomInput from '~/components/CustomInput.vue';

const passwordVisible = ref(false);
const userToken = useCookie("isLoggedIn");
const router = useRouter();
const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const selectedCountry = ref(null);
const selectedState = ref(null);
const registeredAlert = ref(false);

const form = reactive({
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  role: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
    },
  },
});

const registerAlert = () => {
  registeredAlert.value = true;
};

const registerAlertClose = () => {
  registeredAlert.value = false;
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const fetchCountries = async () => {
  try {
    const data = await $fetch(`http://localhost:8080/api/auth/countries`);
    countries.value = data;
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const handleCountryChange = () => {
  if (selectedCountry) {
    fetchStates();
  }
};

const fetchStates = async () => {
  if (!selectedCountry) return;
  try {
    const data = await $fetch(
      `http://localhost:8080/api/auth/state/${selectedCountry.value}`
    );
    states.value = data;
  } catch (error) {
    console.error("Error fetching States:", error);
  }
};

const handleStateChange = () => {
  if (selectedState) {
    fetchCities();
  }
};

const fetchCities = async () => {
  try {
    const data = await $fetch(
      `http://localhost:8080/api/auth/cities/${selectedState.value}`
    );
    cities.value = data;
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const registerUser = async () => {
  try {
    const data = await $fetch("http://localhost:8080/api/auth/user/create", {
      method: "POST",
      body: form,
    });
    if (data === "User SuccessFully Created") {
      form.firstName = "";
      form.lastName = "";
      form.userName = "";
      form.password = "";
      form.role = "";
      form.address.street = "";
      form.address.zipCode = "";
      form.address.city.cityId = null;

      selectedCountry.value = null;
      selectedState.value = null;
      cities.value = [];
      states.value = [];

      // alert("User registered successfully!");
      registerAlert();
      router.push("/userlogin");
    } else {
      alert("Error: " + data);
    }
  } catch (err) {
    console.error("An error occurred during registration:", err);
  }
};

onBeforeMount(() => {
  fetchCountries();
});
</script>
