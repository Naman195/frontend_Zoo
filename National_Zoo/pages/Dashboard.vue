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
const user = ref(null);

const fetchuserdetail = async () => {
  try {
    const data = await $fetch("http://localhost:8080/auth/user-info", {
      method: "GET",
      credentials: "include",
    });

    console.log("Fetched user details:", data);
    user.value = {
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
    return data.json();
  } catch (error) {
    console.error("Error occurred ", error.message);
  }
};

onMounted(() => {
  fetchuserdetail();
});
</script>

<style scoped></style>
