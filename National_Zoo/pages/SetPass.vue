<template>
  <div
    v-if="passwordAlert"
    class="absolute bottom-12 start-1/2 -translate-x-1/2"
  >
    <ShowAlert
      :alert-message:="passwordAlertRes()"
      @close-modal="passAlertClose"
    />
  </div>
  <div class="login-container">
    <h1>Set new Password</h1>

    <form @submit.prevent="handleSetPassword" class="login-form">
      <div v-if="isLoggedIn" class="form-group">
        <label for="oldPassword">Old Password</label>
        <input
          type="password"
          id="oldPassword"
          v-model="oldPassword"
          placeholder="Enter your Old Password"
          required
        />
      </div>
      <div class="form-group">
        <label for="username">Password</label>
        <input
          type="password"
          v-model="newPassword"
          placeholder="Enter your new Password"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Set Pass</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import "../assests/css/LoginStyle.css";
import { useRoute } from "vue-router";

// const token = ref("");
const newPassword = ref("");
const oldPassword = ref("");

const router = useRouter();

const passwordAlert = ref(false);
const passwordAlertMessage = ref("");

const passwordAlertRes = () => {
  return passwordAlertMessage;
};

const afterSetPass = () => {
  passwordAlert.value = true;
};

const passAlertClose = () => {
  passwordAlert.value = false;
};
// token.value = route.query.token;

// const tokenCookie = useCookie("auth");
const isLoggedIn = useCookie("isLoggedIn");

const handleSetPassword = async () => {
  try {
    const requestBody: {newPassword: string; oldPassword?: string} = {
      newPassword: newPassword.value,
    };

    if (isLoggedIn.value) {
      requestBody.oldPassword = oldPassword.value;
    }
    const response :any= await useCustomFetch(`/auth/setpassword`, {
      method: "POST",
      body: requestBody,
    });
    console.log("PAssword Set Successfully", response);
    passwordAlertMessage.value = response;
    afterSetPass();
    setTimeout(() => {
      router.push("/userlogin");
    }, 1000);
  
  } catch (error: any) {
    console.log("Error in Set Pass Password Try Again", error.data);
    passwordAlertMessage.value = error.data;
    afterSetPass();
  }
};
</script>
