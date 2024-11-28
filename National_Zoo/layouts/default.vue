<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-semibold">
        <NuxtLink to="/" class="hover:text-gray-300">National - Zoo</NuxtLink>
      </div>
      <ul class="flex items-center space-x-6 text-white">
        <li><NuxtLink to="/" class="hover:text-gray-300">Home</NuxtLink></li>

        <template v-if="!userToken">
          <li>
            <NuxtLink
              to="/userlogin"
              class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >SignIn</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/userregisteration"
              class="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >SignUp</NuxtLink
            >
          </li>
        </template>
        <template v-else>
          <li>
            <NuxtLink to="/zoo/allzoos" class="hover:text-gray-300"
              >Zoo's</NuxtLink
            >
          </li>
          <!-- <li>
            <NuxtLink to="/allusers" class="hover:text-gray-300"
              >All users</NuxtLink
            >
          </li> -->
          <li class="cursor-pointer" @click="toggleProfile">
            <img
              src="../assests/images/user.png"
              alt="Profile"
              class="h-8 w-8 rounded-full"
            />
          </li>
        </template>
      </ul>
    </div>

    <div
      v-if="isProfileVisible && userProfile"
      class="absolute right-0 mt-2 w-64 bg-white shadow-md p-4 rounded-lg"
    >
      <h2 class="font-bold text-lg">User Profile</h2>
      <p>
        <strong>Name:</strong> {{ userProfile.fullName }}
        {{ userProfile.lastName }}
      </p>
      <p><strong>City:</strong> {{ userProfile.address.city.cityName }}</p>

      <!-- Buttons container -->
      <div class="flex justify-between mt-4">
        <button
          @click="logoutUser"
          class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          @click="
            () => {
              toggleUpdateModal();
              fillupdateFormData();
              // fetchCountries();
            }
          "
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Profile
        </button>
      </div>
    </div>
    <!-- Use Modal for Update Profile -->
    <div v-if="isUpdateModalVisible">
      <AddZoo
       :from-data="form"
       :update-click="true"
       :modal-title="'User Profile Update'"
       :submit-button-label="'Update Profile'" 
       @save="updateUser"
       @close="
          isUpdateModalVisible = false;
          
        "
       />
       
    </div>
    <!-- Main modal for updating profile -->

    <!-- <cuctom :name = /> -->
    <!-- ......new .... -->
  </nav>

  <div v-if="updateAlert" class="absolute top-30 end-0">
    <ShowAlert
      :alert-message="'User Updated  Successfully'"
      @close-modal="closeUpdateAlert"
    />
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>
// import "../assests/css/Navbar.css";
import { ErrorMessage, Field, Form } from "vee-validate";
import "../assests/css/style.css";
import { useAuth } from "~/composables/useAuth";
import { useUserProfile } from "~/composables/useUserProfile";

const router = useRouter();
const { isLoggedIn, logOut } = useAuth();
const { userProfile, setUser, getUser } = useUserProfile();
const userToken = useCookie("isLoggedIn");
const isProfileVisible = ref(false);
const isUpdateModalVisible = ref(false);
const updateAlert = ref(false);

const afterUpdate = () => {
  updateAlert.value = true;
};

const closeUpdateAlert = () => {
  updateAlert.value = false;
};

const logoutUser = () => {
  logOut();
  router.push("/userlogin");
  isProfileVisible.value = false;
};

const toggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value;
};

const toggleUpdateModal = () => {
  isUpdateModalVisible.value = !isUpdateModalVisible.value;
  isProfileVisible.value = false;
  console.log("User LoggedIn data", userProfile);
};

const form = ref({
  fullName: "",
  address: {
    street: "",
    zipCode: "",
    city: {
      cityId: null,
      state: {
        stateId: null,
        country: {
          countryId: null,
        },
      },
    },
  },
});

const fillupdateFormData = () => {
  
  form.value.fullName = userProfile.value.fullName;
  form.value.address.zipCode = userProfile.value.address.zipCode;
  form.value.address.street = userProfile.value.address.street;
  form.value.address.city.cityId = userProfile.value.address.city.cityId;
  form.value.address.city.state.stateId =
  userProfile.value.address.city.state.stateId;
    form.value.address.city.state.country.countryId =
    userProfile.value.address.city.state.country.countryId;
  
};

// Fetch User Profile
const user = ref(null);
const userId = useCookie("userId");

onBeforeMount(() => {
  if (userToken.value == true) {
    // getUser();
    fetchProfile();
    // fetchCountries();
  }
});

// Handle Update Profile Logic
// const form = reactive({
//   fullName: "",
//   address: {
//     street: "",
//     zipCode: "",
//     city: {
//       cityId: null,
//     },
//   },
// });



const fetchProfile = async () => {
  try {
    const fetchedUser = await useCustomFetch(`/auth/user/${userId.value}`);
    userProfile.value = fetchedUser;
    setUser(fetchedUser);
    console.log("FetchEd Profile", fetchedUser);
    
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};



const updateUser = async () => {

 const  resBody = {
      fullName: form.value.fullName,
  address: {
    street: form.value.address.street,
    zipCode: form.value.address.zipCode,
    city: {
      cityId: form.value.address.city.cityId
    },
  },
  }


  try {
    await useCustomFetch(`/auth/userupdate/${userId.value}`, {
      method: "PATCH",
      body: resBody,
    });
    setUser(form);
    afterUpdate();

    toggleUpdateModal();
    // router.push("/");
    isUpdateModalVisible.value = false;
  } catch (err) {
    console.error("Error updating user:", err);
  }
};
</script>
