<template>
  <div class="login-container">
    <h1>Set new Password</h1>

    <form @submit.prevent="handleSetPassword" class="login-form">
      <div v-if="isLoggedIn" class="form-group">
        <label for="oldPassword">Old Password</label>
        <input type="password" id = "oldPassword" v-model="oldPassword" placeholder="Enter your Old Password" required />

      </div>
      <div class="form-group">
        <label for="username">Password</label>
        <input type="password" v-model="newPassword" required />
      </div>

      <button type="submit" class="submit-btn">Set Pass</button>
    </form>
  </div>
</template>

<script setup>
import "../assests/css/LoginStyle.css";
import { useRoute } from "vue-router";

// const token = ref("");
const newPassword = ref("");
const oldPassword = ref("");

const route = useRoute();
const router = useRouter();

// token.value = route.query.token;

const tokenCookie = useCookie("auth");
const isLoggedIn = useCookie("isLoggedIn");
console.log("IsLOgged value is ", isLoggedIn.value);

// const isLoggedIn = computed(() => !!tokenCookie);

// const token = computed(() =>  tokenCookie.value || route.query.token || "");
// const token = tokenCookie.value || route.query.token || "";

// console.log("User LOggedIn Value", userLogin.value);

const handleSetPassword = async () => {
  try {

    const requestBody = {
      newPassword : newPassword.value,
    };

    if(isLoggedIn.value){
      requestBody.oldPassword = oldPassword.value;
    }
    const response = await useCustomFetch(`/auth/setpassword`, {

      method: "POST",
      body: requestBody
    });
    console.log("PAssword Set Successfully", response);
    router.push("/userlogin");
    console.log("Token Value", token);
  } catch (error) {
    console.log("Error in Set Pass Password Try Again", error);
  }
};
</script>
