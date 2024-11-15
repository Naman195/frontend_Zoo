<template>
  <h1>Home Page</h1>
  <!-- <h2></h2> -->
</template>

<script setup>
const { isLoggedIn } = useAuth();
const userId = useCookie("userId");
const token = useCookie("auth");

const { userProfile, setUser, getUser } = useUserProfile();
// console.log("UserProfle is", userProfile);
const fetchProfile = async () => {
  try {
    const fetchedUser = await useCustomFetch(`/auth/user/${userId.value}`);
    userProfile.value = fetchedUser;
    setUser(fetchedUser);
  } catch (error) {
    console.error("Error fetching User:", error);
  }
};

onMounted(() => {
  if (isLoggedIn) {
    // fetchProfile();
  }
});
</script>
