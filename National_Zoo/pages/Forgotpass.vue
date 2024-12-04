<template>
  <div class="absolute top-0 right-0">
    <ShowAlert
      :alert-message="toastMessage"
      :is-visible="isToastVisible"
      @close-modal="closeToast"
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

const toastMessage: Ref<string> = ref("");
const isToastVisible = ref(false);

const closeToast = () => {
  isToastVisible.value = false;
};

const loader = ref(false);

const forgetPassAlert = ref(false);
const forgotPassmessage = ref("");

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
    toastMessage.value = response.message;
    isToastVisible.value = true;

    const email = response.email;
    setTimeout(() => {
      router.push({ path: "/otpverify", query: { email } });
    }, 1000);
  } catch (error: any) {
    console.log("Response is", error.response._data.message );

    toastMessage.value = error.message;
    isToastVisible.value = true;
  }
};
</script>

<style></style>
