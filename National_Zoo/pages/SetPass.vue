<template>
  <div class="login-container">
    <h1>Set new Password</h1>

    <form @submit.prevent="handleSetPassword" class="login-form">
      <div class="form-group">
        <label for="username">Password</label>
        <input type="password" v-model="setPassword" required />
      </div>

      <button type="submit" class="submit-btn">Set Pass</button>
    </form>
  </div>
</template>

<script setup>
import "../assests/css/LoginStyle.css";
import { useRoute } from "vue-router";

// const token = ref("");
const setPassword = ref("");
const route = useRoute();
const router = useRouter();

// token.value = route.query.token;

const tokenCookie = useCookie("auth");
const token = tokenCookie.value || route.query.token || "";

// console.log("User LOggedIn Value", userLogin.value);

const handleSetPassword = async () => {
  try {
    const response = await useCustomFetch(`/auth/setpassword`, {
      method: "POST",
      body: setPassword.value,
    });
    console.log("PAssword Set Successfully", response);
    router.push("/userlogin");

    console.log("Token Value", token);
  } catch (error) {
    console.log("Error in Set Pass Password Try Again", error);
  }
};
</script>
