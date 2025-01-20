<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <img :src="user.picture" alt="User Profile Picture" />
    </div>
    <div v-else>
      <p>No user information available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null); // Start with null to differentiate between empty and undefined.

const fetchuserdetail = async () => {
  try {
    const data = await $fetch("http://localhost:8080/auth/user-info", {
      method: "GET",
      credentials: "include",
    });

    console.log("Fetched user details:", data); // Debug log
    user.value = {
      name: data.name,
      email: data.email,
      picture: data.picture, // Add picture if you want to display it
    }; // Map the relevant fields
  } catch (error) {
    console.error("Error occurred while fetching user details:", error.message);
  }
};

onMounted(() => {
  fetchuserdetail();
});
</script>

<style scoped></style>
