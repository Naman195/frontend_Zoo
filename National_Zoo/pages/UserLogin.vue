<template>
  <div class="login-container">
    <h1>Login Page</h1>

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

      <div class="social-buttons-container">
        <button class="social-btn google-btn" @click="googleLogin">
          <i class="fab fa-google"></i> Sign In with Google
        </button>
        <button class="social-btn github-btn" @click="gitHubLogin">
          <i class="fab fa-github"></i> Sign In with GitHub
        </button>
      </div>

      <p class="note">
        If new user, please <NuxtLink to="/userregisteration">sign up</NuxtLink>
      </p>
      <p class="note">
        Forgot Password, <NuxtLink to="/forgotpass">forgot password</NuxtLink>
      </p>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { Field, Form, ErrorMessage } from "vee-validate";
import "../assests/css/LoginStyle.css";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import type { userLogin } from "~/types/userLogin";
import { useUserStore } from "~/store/user";
import { useToastNotify } from "~/composables/useToastNotify";
import type { User } from "~/types/User";

const { showToast } = useToastNotify();
const { logIn } = useAuth();
const passwordVisible = ref(false);
const token = useCookie("auth");
const refreshToken = useCookie("refreshToken");
const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});

const googleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

const gitHubLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/github";
};

const userStore = useUserStore();

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const loginUser = async () => {
  try {
    const data = await $fetch<userLogin>(`/api/login`, {
      method: "POST",
      body: form,
    });

    // token.value = data.token;
    // refreshToken.value = data.refreshToken;
    logIn(data.userId);
    if (data.user) {
      const user: User = data.user;
      userStore.setUser(user);
    } else {
      throw new Error("User data is null");
    }
    showToast(data.message, "green");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (err: any) {
    showToast(err.response._data.data.message, "red");
  }
};
</script>
