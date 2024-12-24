<template>
  <h1>UserProfile</h1>
  <section class="container mx-auto p-10 md:p-20 antialiased">
    <article
      class="flex flex-wrap md:flex-nowrap shadow-lg mx-auto max-w-3xl group cursor-pointer transform duration-500 hover:-translate-y-1"
    >
      <img
        class="w-full max-h-[400px] object-cover md:w-80"
        :src="imageUrl"
        alt=""
      />
      <div class="">
        <div class="p-5 pb-10">
          <h1 class="text-2xl font-semibold text-gray-800 mt-4">User Info</h1>

          <div>
            <h2>
              <b>Name: {{ userProfile.fullName }}</b>
            </h2>
            <h2>
              <b>Email: {{ userProfile.email }}</b>
            </h2>
            <h2>
              <b>Username: {{ userProfile.username }}</b>
            </h2>
            <h2>
              <b>Street: {{ userProfile.address.street }}</b>
            </h2>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
const userProfile = useCookie("user");
console.log("UserProfile is ", userProfile.value);
var imageUrl = `http://192.168.0.153:8081/${userProfile.value.image}`;
</script>
