<template>
  <div v-if="forgetPassAlert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="forgotPassAlertRes()"
      @close-modal="forgetPassAlert = false"
    />
  </div>
  <div class="login-container">
    <h1>Forgot Password</h1>

    <form @submit.prevent="handleForgotPassword" class="login-form">
      <div class="form-group">
        <label for="username">Email</label>
        <input type="text" v-model="form.email" required />
      </div>

      <button type="submit" class="submit-btn">Forgot Pass</button>
    </form>
  </div>
</template>

<script setup>
import "../assests/css/LoginStyle.css";

const form = ref({
  email: ""
})


const forgetPassAlert = ref(false);
const forgotPassmessage = ref("")
const forgotPassAlertRes = () => {
  return forgotPassmessage;
}

const router = useRouter();

const handleForgotPassword = async () => {
  try {
    const response = await useCustomFetch(`/auth/forgotpassword`, {
      method: "POST",
      headers:  {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value)
    });

   console.log("Response is", response);
   forgotPassmessage.value = response.message
   forgetPassAlert.value = true;
   const email = response.email;
   setTimeout(() => {
     router.push({ path: '/otpverify', query: { email } });
    
   }, 1000);
   
  } catch (error) {
    console.log("An error occurred: " + error);
  }
};
</script>

<style></style>
