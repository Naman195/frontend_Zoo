<template>
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
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();

interface obj {
  email: string;
  message: string;
}

const form = ref<{ email: string }>({
  email: "",
});

const loader = ref(false);
const router = useRouter();

const handleForgotPassword = async (): Promise<void> => {
  loader.value = true;
  try {
    const response = await useCustomFetch<obj>(`/auth/forgotpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    showToast(response.message, "green");

    const email = response.email;
    setTimeout(() => {
      router.push({ path: "/otpverify", query: { email } });
    }, 1000);
  } catch (error: any) {
    loader.value = false;
    showToast(error.response._data.message, "red");
  }
};
</script>
