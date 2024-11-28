<template>
  <div
    v-if="forgetPassAlert"
    class="absolute top-11 start-1/2 -translate-x-1/2"
  >
    <ShowAlert
      :alert-message:any="forgotPassAlertRes()"
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

      <button v-if="!loader" type="submit" class="submit-btn">
        Forgot Pass
      </button>
      <div v-else class="flex justify-center">
        <Loader />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import "../assests/css/LoginStyle.css";

const form = ref<{ email: string }>({
  email: "",
});

const loader = ref(false);

const forgetPassAlert = ref(false);
const forgotPassmessage = ref("");

const forgotPassAlertRes = () => {
  return forgotPassmessage;
};

const router = useRouter();

const handleForgotPassword = async (): Promise<void> => {
  loader.value = true;
  try {
    const response: any = await useCustomFetch(`/auth/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    console.log("Response is", response);
    forgotPassmessage.value = response.message;
    forgetPassAlert.value = true;
    const email = response.email;
    //  setTimeout(() => {
    router.push({ path: "/otpverify", query: { email } });

    //  }, 1000);
  } catch (error: any) {
    console.log("An error occurred: " + error);
  }
};
</script>

<style></style>
