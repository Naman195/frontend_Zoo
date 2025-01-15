<template>
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

<script setup lang="ts">
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();
const newPassword = ref("");
const oldPassword = ref("");
const router = useRouter();
const isLoggedIn = useCookie("isLoggedIn");
// const route = useRoute();
// const uniqueKey = route.query.key as string;

const handleSetPassword = async () => {
  try {
    const requestBody: { newPassword: string; oldPassword: string } = {
      newPassword: newPassword.value,
      oldPassword: oldPassword.value,
    };

    const response = await $fetch<string>(`/api/updatePassword`, {
      method: "POST",

      body: requestBody,
    });
    showToast(response, "green");
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } catch (error: any) {
    showToast(error.data || "An error occurred.", "red");
  }
};
</script>
