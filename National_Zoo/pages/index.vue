<template>
  <h1>Home Page</h1>
  <!-- <h2></h2> -->
</template>

<script setup>
import { useUserProfile } from "~/composables/useUserProfile";
import { useAuth } from "~/composables/useAuth";

const { isLoggedIn } = useAuth();
const userId = useCookie("userId");
const token = useCookie("auth");

const { userProfile, setUser, getUser } = useUserProfile();
// console.log("UserProfle is", userProfile);
const fetchProfile = async () => {
  try {
    const fetchedUser = await $fetch(
      `http://localhost:8080/api/auth/user/${userId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    userProfile.value = fetchedUser;
    setUser(fetchedUser);
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};

onBeforeMount(() => {
  //   console.log("LoggedIn Value", isLoggedIn);
  if (isLoggedIn) {
    fetchProfile();
  }
});
</script>
