<template>
  <div class="otp-container">
    <h1>Enter OTP</h1>
    <form @submit.prevent="submitOtp">
      <div class="otp-inputs">
        <input
          v-for="(digit, index) in otpArray"
          :key="index"
          type="text"
          maxlength="1"
          v-model="otpArray[index]"
          @input="moveFocus(index, $event)"
          class="otp-box"
        />
      </div>
      <button type="submit" :disabled="isDisabled">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import "../assests/css/Otpverify.css";
import { useToastNotify } from "~/composables/useToastNotify";

const { showToast } = useToastNotify();

interface resObj {
  message: string;
  key: string;
}

const form = ref<{ email: string; otp: string }>({
  email: "",
  otp: "",
});

const otpArray = ref<string[]>(new Array(5).fill(""));
const isDisabled = computed(() => otpArray.value.some((digit) => digit === ""));

const moveFocus = (index: number, event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.value && index < otpArray.value.length - 1) {
    const nextInput = input.nextElementSibling as HTMLInputElement | null;
    nextInput?.focus();
  }
};

const route = useRoute();
const router = useRouter();
const email = route.query.email as string;

const submitOtp = async () => {
  form.value.otp = otpArray.value.join("");

  try {
    const response = <resObj>await useCustomFetch("/auth/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (response.message === "OTP verified successfully") {
      const uniqueKey = response.key;
      console.log("Token Key", response.key);

      // const url = new URL(resetUrl);
      // const path = url.pathname;
      // const query = url.search;
      showToast("OTP verified successfully", "blue");

      setTimeout(() => {
        router.push({
          path: "/UpdatePass",
          query: { uniqueKey },
        });
      }, 1000);
    } else {
      showToast(
        response.message || "Verification failed. Please try again.",
        "red"
      );
    }
  } catch (error: any) {
    showToast(
      error.response._data.message || "Verification failed. Please try again.",
      "red"
    );
  }
};

onMounted(() => {
  form.value.email = email;
});
</script>
