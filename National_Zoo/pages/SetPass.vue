<template>
  <div class="absolute top-0 right-0">
    <ShowAlert
      :alert-message="toastMessage"
      :is-visible="isToastVisible"
      @close-modal="closeToast"
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

const newPassword = ref("");
const oldPassword = ref("");
const toastMessage: Ref<string> = ref("");
const isToastVisible = ref(false);
const router = useRouter();
const isLoggedIn = useCookie("isLoggedIn");

const closeToast = () => {
  isToastVisible.value = false;
};

const handleSetPassword = async () => {
  try {
    const requestBody: { newPassword: string; oldPassword?: string } = {
      newPassword: newPassword.value,
    };

    if (isLoggedIn.value) {
      requestBody.oldPassword = oldPassword.value;
    }

    const response = <string>await useCustomFetch(`/auth/setpassword`, {
      method: "POST",
      body: requestBody,
    });

    console.log("Response is ", response);

    toastMessage.value = response;
    isToastVisible.value = true;

    setTimeout(() => {
      router.push("/userlogin");
    }, 1000);
  } catch (error: any) {
    toastMessage.value = error.data;
    isToastVisible.value = true;
  }
};
</script>
