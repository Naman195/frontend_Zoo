<template>
  <div class="login-container">
    <h1>Set Password</h1>

    <form @submit.prevent="handleSetPassword" class="login-form">
      <div class="form-group">
        <label for="newPassword">Password</label>
        <input
          type="password"
          v-model="newPassword"
          placeholder="Enter your new Password"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Set Password</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();
const newPassword = ref("");
const route = useRoute();
const uniqueKey = route.query.uniqueKey;
const router = useRouter();
console.log("tokenKey in SetPsss page", uniqueKey);

const handleSetPassword = async () => {
  try {
    const requestBody = {
      newPassword: newPassword.value,
      tokenKey: uniqueKey,
    };

    const response = await $fetch<string>(
      `http://localhost:8080/auth/setpassword`,
      {
        method: "POST",
        body: requestBody,
      }
    );
    showToast(response, "green");
    setTimeout(() => {
      router.push("/userlogin");
    }, 3000);
  } catch (error: any) {
    showToast(error.data.detail || "An error occurred.", "red");
  }
};
</script>
