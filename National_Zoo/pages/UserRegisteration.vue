<template>
  <div v-if="registeredAlert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="registerAlertRes()"
      @close-modal="registerAlertClose"
    />
  </div>
  <div class="register-container">
    <h1>User Registration Page</h1>

    <Form @submit="registerUser" class="register-form">
      <div class="register-pair">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <Field
            name="firstName"
            label="First Name"
            type="text"
            v-model="form.firstName"
            rules="required|alpha"
          />
          <ErrorMessage name="firstName" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <Field
            name="lastName"
            label="Last Name"
            type="text"
            v-model="form.lastName"
            rules="required|alpha"
          />
          <ErrorMessage name="lastName" class="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="userName">Username</label>
          <Field
            name="username"
            label="User Name"
            type="text"
            v-model="form.userName"
            rules="required|alpha"
          />
          <ErrorMessage name="username" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-container">
            <Field
              label="Password"
              name="password"
              :type="passwordVisible ? 'text' : 'password'"
              v-model="form.password"
              rules="required|min:6"
            />
            <span class="eye-icon" @click="togglePasswordVisibility">
              <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </span>
          </div>
          <ErrorMessage name="password" class="text-red-600 text-sm mt-1" />
          <!-- <input type="password" v-model="form.password" minlength="8" required /> -->
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="country">Country</label>
          <Field
            name="country"
            as="select"
            v-model="selectedCountry"
            @change="handleCountryChange"
            rules="required"
          >
            <!-- <option value="null">Select Country</option> -->
            <option value="" disabled>Select Country</option>
            <option
              v-for="country in countries"
              :key="country.countryId"
              :value="country.countryId"
            >
              {{ country.countryName }}
            </option>
          </Field>
          <ErrorMessage name="country" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="form-group">
          <label for="state">State</label>
          <Field
            name="state"
            as="select"
            rules="required"
            v-model="selectedState"
            :disabled="!selectedCountry"
            @change="handleStateChange"
          >
            <option value="">Select State</option>
            <option
              v-for="state in states"
              :key="state.stateId"
              :value="state.stateId"
            >
              {{ state.stateName }}
            </option>
          </Field>
          <ErrorMessage name="state" class="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="city">City</label>
          <Field
            name="city"
            as="select"
            rules="required"
            v-model="form.address.city.cityId"
            :disabled="!selectedState"
          >
            <option value="">Select City</option>
            <option
              v-for="city in cities"
              :key="city.cityId"
              :value="city.cityId"
            >
              {{ city.cityName }}
            </option>
          </Field>
          <ErrorMessage name="city" class="text-red-600 text-sm mt-1" />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <Field name="role" as="select" v-model="form.role" rules="required">
            <option value="" selected disabled>Select Role</option>
            <option v-for="r in roles" :value="r.roleId">
              {{ r.role }}
            </option>
          </Field>

          <ErrorMessage name="role" class="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <div class="register-pair">
        <div class="form-group">
          <label for="street">Street</label>
          <Field
            label="Street"
            name="street"
            rules="required|alpha_spaces"
            type="text"
            v-model="form.address.street"
            required
          />
          <ErrorMessage name="street" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="form-group">
          <label for="zipCode">Zip Code</label>
          <Field
            label="zip Code"
            name="zipCode"
            rules="required|digits:6"
            type="text"
            v-model="form.address.zipCode"
            required
          />
          <ErrorMessage name="zipCode" class="text-red-600 text-sm mt-1" />
        </div>
      </div>

      <button type="submit" class="submit-btn">Register</button>
    </Form>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate";
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
const afterRegisterationMessage = ref("");
const roles = ref([]);

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

const registerAlertRes = () => {
  return afterRegisterationMessage;
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
    const data = await useCustomFetch("/auth/user/create", {
      method: "POST",
      body: form,
    });
    console.log("Registered User", data);
    if (data === "User successfully created") {
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
      afterRegisterationMessage.value = data;
      registerAlert();
      setTimeout(() => {
        router.push("/userlogin");
      }, 3000);
    } else {
      afterRegisterationMessage.value = data;
      alert("Error: " + data.response);
    }
  } catch (err) {
    afterRegisterationMessage.value = err.response._data;
    console.error("An error occurred during registration:", err.response);
    registerAlert();
  }
};

// Fetch Role Api

const fetchRoles = async () => {
  try {
    const data = await useCustomFetch("/role/all");
    roles.value = data;
  } catch (error) {
    console.log("Error In fetching Roles", error);
  }

  // console.log(data);
  console.log(roles);
};

onMounted(() => {
  fetchCountries();
  fetchRoles();
});
</script>
