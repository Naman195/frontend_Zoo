<template>
  <div class="relative w-100 h-screen">
    <img
      src="https://images.nightcafe.studio/jobs/3edOoYF3sMUVu4vvZdSD/3edOoYF3sMUVu4vvZdSD--1--o0g2z.jpg"
      alt="background"
      srcset=""
      class="absolute top-0 left-0 w-full h-full object-cover"
    />
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <!-- <h1 class="text-5xl font-bold text-green-800">National Zoo</h1> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
const route = useRoute();
const router = useRouter();
const userId = route.query.userId;

const { logIn } = useAuth();

onBeforeMount(() => {
  if (userId != undefined) {
    logIn(userId);
  }
});
</script>
