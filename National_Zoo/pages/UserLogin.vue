<template>
    <div class="login-container">
      <h1>User Login Page</h1>
  
      <form @submit.prevent="loginUser" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" v-model="form.username" required />
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" v-model="form.password"  required />
        </div>
  
        <button type="submit" class="submit-btn">Login</button>
  
        <p class="note">
          If new user, please <NuxtLink to="/userregisteration">sign up</NuxtLink>
        </p>
      </form>
    </div>
  </template>
  
  <script setup >

  import "../assests/css/LoginStyle.css";
  import { useAuth } from '@/composables/useAuth';

  const { logIn } = useAuth(); 
 
 const router = useRouter()
 
  
  const form = reactive({
    username: '',
    password: '',
  });

  
  const loginUser = async () => {
    try {
      const data = await $fetch('http://localhost:8080/api/zoo/login', {
        method: 'POST',
        body: form,
      });
      
      logIn(data.userId);

      router.push({ path: '/' });

      

    } catch (err) {
      console.error('An error occurred during login:', err);
    }
  };

  // definePageMeta({
  //   middleware : 'redirect-logged-in'
  // });






  </script>
  
 