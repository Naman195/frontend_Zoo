<template>
  <div class="login-container">
    <h1>User Login Page</h1>

    <form @submit.prevent="loginUser" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="form.username" required />
      </div>

      <!-- <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="form.password"  required />
        </div> -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-container">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="form.password"
            required
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
    </form>
  </div>
</template>

<script setup>
import "../assests/css/LoginStyle.css";
import { useAuth } from "@/composables/useAuth";

const { logIn, logOut } = useAuth();
const { userProfile, setUser, getUser } = useUserProfile();

const router = useRouter();
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const form = reactive({
  username: "",
  password: "",
});

const token = useCookie("auth", { maxAge: 3600 });

const loginUser = async () => {
  try {
    const data = await $fetch("http://localhost:8080/api/auth/user/login", {
      method: "POST",
      body: form,
    });

    token.value = data.token;

    logIn(data.userId);

    router.push({ path: "/" });
  } catch (err) {
    console.error("An error occurred during login:", err);
  }
};

// definePageMeta({
//   middleware : 'redirect-logged-in'
// });
</script>
