<template>
  <div>
    <h1>Logging in...</h1>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();

const fetchUserInfo = async () => {
  try {
    const response = await $fetch('http://localhost:8080/auth/user-info', {
      method: 'GET',
      credentials: 'include', // Include cookies for session management
    });

    if (response.ok) {
      const userInfo = await response.json();
      console.log("UserInfo", userInfo);
      
      // Store user info in session storage or state management
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      // Redirect to the dashboard
      router.push('/dashboard'); // Adjust the route as needed
    } else {
      console.error('Failed to fetch user info:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

onMounted(() => {
  // Call the fetchUser Info function after the component is mounted
  fetchUserInfo();
});
</script>