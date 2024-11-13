<template>
  <div class="login-container">
    <h1>Forgot Password</h1>

    <form @submit.prevent="handleForgotPassword" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="username" required />
      </div>

      <button type="submit" class="submit-btn">Forgot Pass</button>
    </form>
  </div>
</template>

<script setup>
import "../assests/css/LoginStyle.css";

const username = ref("");

const handleForgotPassword = async () => {
  try {
    const response = await useCustomFetch(`/auth/forgotpassword`, {
      method: "POST",
      body: username.value,
    });

    console.log("Url is", response);
  } catch (error) {
    console.log("An error occurred: " + error);
  }
};
</script>

<style></style>
