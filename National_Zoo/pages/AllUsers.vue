<template>
    <div class="card-grid">
      <div class="card" v-for="user in filteredUsers" :key="user.id">
        <div class="card-body">
          <h5 class="card-title">{{ user.firstName }} {{ user.lastName }}</h5>
          <p class="card-text">{{ user.userId }}</p>
          <p class="card-text">{{ user.address.zipCode }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import '../assests/css/AllUsers.css'

    

    const userLoggedInId = useCookie('userId');
    console.log("LoggedI User Id from All Users",userLoggedInId.value);
    
  const users = ref([]);

 const filteredUsers = ref([])

  
  
  const fetchUsers = async () => {
    try {
      const data = await $fetch("http://localhost:8080/api/zoo/users");
      users.value = data;

      filteredUsers.value = users.value.filter(user => user.userId !== userLoggedInId.value);
      console.log(filteredUsers.value);
      
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };
  
  onMounted(() => {
    fetchUsers();
  });
  </script>
  
