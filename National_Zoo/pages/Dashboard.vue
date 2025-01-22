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
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const userId = route.query.userId;

const { logIn } = useAuth();

onMounted(() => {
  logIn(userId);
});
</script>

<style scoped></style>
