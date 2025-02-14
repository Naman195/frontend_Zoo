<template>
  <div class="register-container">
    <h1>Registration Page</h1>
    <!-- :key="formkey" -->
    <Form @submit="registerUser" class="register-form" :key="formkey">
      <div class="register-pair">
        <div class="form-group">
          <label for="fullname">Full Name</label>
          <Field
            name="fullname"
            label="Full Name"
            type="text"
            v-model="form.fullName"
            rules="required|alpha_spaces"
          />
          <ErrorMessage name="fullname" class="text-red-600 text-sm mt-1" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <Field
            name="email"
            label="Email"
            type="email"
            v-model="form.email"
            rules="required|email"
          />
          <ErrorMessage name="email" class="text-red-600 text-sm mt-1" />
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
            rules="required|alpha_num"
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
              :key="country.countryId!"
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
            <option value="" disabled>Select State</option>
            <option
              v-for="state in states"
              :key="state.stateId!"
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
              :key="city.cityId!"
              :value="city.cityId"
            >
              {{ city.cityName }}
            </option>
          </Field>
          <ErrorMessage name="city" class="text-red-600 text-sm mt-1" />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <Field name="role" as="select" v-model="form.roleId" rules="required">
            <option value="" selected disabled>Select Role</option>
            <option v-for="r in roles" :value="r.id">
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

      <div class="form-group">
        <label for="image">Profile Image</label>
        <Field
          label="ProfilePic"
          name="profilepic"
          type="file"
          v-model="form.image"
          onselect="handleFileUpload"
        />
        <ErrorMessage name="Prfile Pic" class="text-red-600 text-sm mt-1" />
      </div>

      <button type="submit" class="submit-btn">Register</button>
      <p class="note">
        Having Already Account, please
        <NuxtLink to="/userlogin">sign In</NuxtLink>
      </p>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Field, Form, ErrorMessage } from "vee-validate";
import "../assests/css/style.css";
import type { Country } from "~/types/Country";
import type { State } from "~/types/State";
import type { City } from "~/types/City";
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();

interface Role {
  id: number;
  role: string;
}

const passwordVisible = ref(false);
const router = useRouter();
const countries = ref<Country[]>([]);
const states = ref<State[]>([]);
const cities = ref<City[]>([]);
const selectedCountry = ref(null);
const selectedState = ref(null);
const roles = ref<Role[]>([]);

var formkey = Math.random();

const form = reactive({
  fullName: "",
  email: "",
  userName: "",
  password: "",
  roleId: "",
  image: null,
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
    },
  },
});

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const fetchCountries = async () => {
  try {
    const data = await $fetch<Country[]>(`http://localhost:8080/country/all`);
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
    const data = await $fetch<State[]>(
      `http://localhost:8080/state/${selectedCountry.value}`
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
    const data = await $fetch<City[]>(
      `http://localhost:8080/city/${selectedState.value}`
    );
    cities.value = data;
  } catch (error) {
    console.error("Error fetching Cities:", error);
  }
};

const registerUser = async () => {
  console.log("Updated Image", form.image);

  try {
    const formDataNew = new FormData();

    formDataNew.append(
      "user",
      JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        userName: form.userName,
        password: form.password,
        roleId: form.roleId,
        address: {
          street: form.address.street,
          zipCode: form.address.zipCode,
          city: {
            cityId: form.address.city.cityId,
          },
        },
      })
    );
    if (form.image) {
      formDataNew.append("file", form.image);
    }

    const data = await $fetch<string>("/api/register", {
      method: "POST",
      body: formDataNew,
    });
    showToast(data, "green");

    if (data === "User registered successfully.") {
      formkey = Math.random();
      form.fullName = "";
      form.email = "";
      form.userName = "";
      form.password = "";
      form.roleId = "";
      form.address.street = "";
      form.address.zipCode = "";
      form.address.city.cityId = null;

      selectedCountry.value = null;
      selectedState.value = null;
      cities.value = [];
      states.value = [];

      setTimeout(() => {
        router.push("/userlogin");
      }, 3000);
    }
    // else {
    //   showToast("Error during SignUp Please Try Again", "red");
    // }
  } catch (err: any) {
    console.log("Exception", err.response._data.data);
    showToast(err.response._data.data, "red");
  }
};

// Fetch Role Api
const fetchRoles = async () => {
  try {
    const data = await $fetch<Role[]>(`/api/fetch-role`, {
      method: "GET",
    });
    roles.value = data;
  } catch (error) {
    console.log("Error In fetching Roles", error);
  }
};

onMounted(() => {
  fetchCountries();
  fetchRoles();
});
</script>
