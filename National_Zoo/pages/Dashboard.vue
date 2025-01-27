<template>
  <div>
    <h1>Dashboard</h1>
    <div>
      <p><strong>Name:</strong></p>
      <p><strong>Email:</strong></p>
      <!-- <img :src="user.picture" alt="User Profile Picture" /> -->
    </div>
    <!-- <div v-else>
      <p>No user information available.</p>
    </div> -->
  </div>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";
import { useUserStore } from "~/store/user";

const route = useRoute();
const router = useRouter();
const userId = route.query.userId;
const token = route.query.token;

console.log("UserId", userId);
console.log("Token", token);

const { logIn } = useAuth();
const userStore = useUserStore();

const userProfile = async () => {
  try {
    const data = await $fetch(`http://localhost:8080/auth/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    userStore.setUser(data);
    navigateTo("/");
  } catch (error) {
    console.log("Error Occured:", error);
  }
};

onMounted(() => {
  userProfile();
  logIn(userId);
});
</script>

<style scoped></style>
