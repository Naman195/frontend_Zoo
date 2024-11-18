<template>
  <div v-if="logInAlert" class="z-50 absolute top-1/2">
    <ShowAlert
      :alert-message="afterLoginMessageRes"
      @close-modal="handleLoginAlertClose"
    />
  </div>
  <div class="login-container">
    <h1>User Login Page</h1>

    <Form @submit="loginUser" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <Field
          label="User Name"
          name="username"
          rules="alpha|required"
          type="text"
          v-model="form.username"
        />
        <ErrorMessage name="username" class="text-red-600 text-sm mt-1" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-container">
          <Field
            label="Password"
            name="password"
            rules="required|min:6"
            :type="passwordVisible ? 'text' : 'password'"
            v-model="form.password"
          />
          <span class="eye-icon" @click="togglePasswordVisibility">
            <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
        <ErrorMessage name="password" class="text-red-600 text-sm mt-1" />
      </div>

      <button type="submit" class="submit-btn">Login</button>

      <p class="note">
        If new user, please <NuxtLink to="/userregisteration">sign up</NuxtLink>
      </p>
    </Form>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate";

import "../assests/css/LoginStyle.css";
import { useAuth } from "@/composables/useAuth";
import { useUserProfile } from "@/composables/useUserProfile";
import { useRouter } from "vue-router";
import { useCookie } from "#app";

const { logIn } = useAuth();
const afterLoginMessageRes = ref("");
const logInAlert = ref(false);
const passwordVisible = ref(false);
const token = useCookie("auth", { maxAge: 3600 });
const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const loginAlertopen = () => {
  logInAlert.value = true;
};

const handleLoginAlertClose = () => {
  logInAlert.value = false;
  // router.push({ path: "/" });
};

const loginUser = async () => {
  try {
    const data = await useCustomFetch("/auth/user/login", {
      method: "POST",
      body: form,
    });
    token.value = data.token;
    logIn(data.userId);
    afterLoginMessageRes.value = data.message;
    loginAlertopen();
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (err) {
    afterLoginMessageRes.value = err.response._data.message;
    loginAlertopen();
    console.error(
      "An error occurred during login:",
      err.response._data.message
    );
  }
};
</script>
