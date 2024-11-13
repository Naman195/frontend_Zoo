<template>
  <div v-if="logInAlert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="afterLoginMessageRes.value"
      @close-modal="handleLoginAlertClose"
    />
  </div>
  <div class="login-container">
    <h1>User Login Page</h1>

    <Form @submit="loginUser" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <Field
          name="username"
          rules="required"
          type="text"
          v-model="form.username"
        />
        <ErrorMessage name="username" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-container">
          <Field
            name="password"
            rules="required"
            :type="passwordVisible ? 'text' : 'password'"
            v-model="form.password"
          />
          <span class="eye-icon" @click="togglePasswordVisibility">
            <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
      </div>

      <button type="submit" class="submit-btn">Login</button>

      <p class="note">
        If new user, please <NuxtLink to="/userregisteration">sign up</NuxtLink>
      </p>
    </Form>
  </div>
</template>

<script setup>
import { defineRule, Field, Form,ErrorMessage } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

import "../assests/css/LoginStyle.css";
import { useAuth } from "@/composables/useAuth";
import { useUserProfile } from "@/composables/useUserProfile";
import { useRouter } from 'vue-router';
import { useCookie } from "#app";

const { logIn } = useAuth();
const { setUser } = useUserProfile();

const afterLoginMessageRes = ref("");
const logInAlert = ref(false);

const passwordVisible = ref(false);
const form = reactive({
  username: "",
  password: "",
});

const token = useCookie("auth", { maxAge: 3600 });
const router = useRouter();

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const loginAlertopen = () => {
  logInAlert.value = true;
};

const handleLoginAlertClose = () => {
  logInAlert.value = false;
  router.push({ path: "/" }); // Redirect after closing the alert
};

const loginUser = async () => {
  try {
    const data = await useCustomFetch("/auth/user/login", {
      method: "POST",
      body: form,
    });

    // Set the token and update the user profile
    token.value = data.token;
    logIn(data.userId);
    afterLoginMessageRes.value = data.message;
    loginAlertopen();
  } catch (err) {
    afterLoginMessageRes.value = err.response._data.message;
    loginAlertopen();
    console.error("An error occurred during login:", err.response._data.message);
  }
};
</script>
