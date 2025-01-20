<template>
  <div>
    <h2>Hello from dshBoard</h2>
    <div>
      <p><strong>Email:</strong> { user.email}</p>
    </div>
  </div>
</template>

<script setup>
const user = ref({});

const fetchuserdetail = async () => {
  try {
    const data = $fetch("http://localhost:8080/auth/user-info", {
      withDefaults: true,
    });

    user.value = data;
  } catch (error) {
    console.error("Error in Occured", error);
  }
};

onMounted(() => {
  fetchuserdetail();
});
</script>

<style></style>
