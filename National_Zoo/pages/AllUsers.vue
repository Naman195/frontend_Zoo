<template>
  <div class="card-grid">
    <!-- <div> -->
    <div v-if="openModal" class="z-50 absolute top-1/2">
      <Modal @delete-user="deleteUserApi" @close-modal="openModal = false" />
    </div>
    <div class="card" v-for="user in filteredUsers" :key="user.userId">
      <div class="card-body">
        <h5 class="card-title">{{ user.firstName }} {{ user.lastName }}</h5>
        <p class="card-text">{{ user.userId }}</p>
        <p class="card-text">{{ user.address.zipCode }}</p>
        <div class="flex justify-between mt-4">
          <button
            class="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
          >
            Update
          </button>
          <button
            @click="
              () => {
                getUserId(user);
                openModal = true;
              }
            "
            class="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup>
import "../assests/css/AllUsers.css";
const userId = ref(null);
const getUserId = (user) => {
  userId.value = user.userId;
  console.log("Delete User Id", userId.value);
};

const deleteUserApi = () => {
  deleteUser();
  openModal.value = false;
};

const count = ref(0);

const openModal = ref(false);
const userLoggedInId = useCookie("userId");

const users = ref([]);

const filteredUsers = ref([]);

const fetchUsers = async () => {
  try {
    const data = await $fetch("http://localhost:8080/api/zoo/users");
    users.value = data;

    filteredUsers.value = users.value.filter(
      (user) => user.userId !== userLoggedInId.value
    );
    // console.log(filteredUsers.value);
  } catch (error) {
    console.error("Error fetching Users:", error);
  }
};

const deleteUser = async () => {
  try {
    const deleteUser = await $fetch(
      `http://localhost:8080/api/zoo/delete/${userId.value}`,
      {
        method: "PATCH",
      }
    );
    fetchUsers();
    //alert(deleteUser);
    console.log("Data Deleted");
  } catch (error) {
    alert("error in deleting the User", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
