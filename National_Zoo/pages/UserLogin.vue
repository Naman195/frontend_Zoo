<template>
  <div class="absolute top-0 right-0">
    <ShowAlert
      :alert-message="toastMessage"
      :is-visible="isToastVisible"
      @close-modal="closeToast"
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
      <p class="note">
        Forgot Pass, <NuxtLink to="/forgotpass">forgot pass</NuxtLink>
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

const toastMessage: Ref<string> = ref("");
const isToastVisible = ref(false);

const { logIn } = useAuth();

const passwordVisible = ref(false);
const token = useCookie("auth", { maxAge: 3600 });
const router = useRouter();
const form = reactive({
  username: "",
  password: "",
});

const closeToast = () => {
  isToastVisible.value = false;
};

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const loginUser = async () => {
  try {
    const data = await useCustomFetch<userLogin>("/auth/user/login", {
      method: "POST",
      body: form,
    });
    console.log("Data is ", data);

    token.value = data.token;
    logIn(data.userId);

    toastMessage.value = data.message;
    isToastVisible.value = true;
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (err: any) {
    toastMessage.value = err.response._data.message;
    isToastVisible.value = true;
  }
};
</script>
