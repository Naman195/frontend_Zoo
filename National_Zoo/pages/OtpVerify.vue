<template>
  <div>
    <ShowAlert
      :alert-message="toastMessage"
      :is-visible="isToastVisible"
      @close-modal="closeToast"
    />
  </div>
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

interface resObj {
  message: string;
  url: string;
}

const toastMessage: Ref<string> = ref("");
const isToastVisible = ref(false);

const form = ref<{ email: string; otp: string }>({
  email: "",
  otp: "",
});

const otpArray = ref<string[]>(new Array(5).fill(""));
const isDisabled = computed(() => otpArray.value.some((digit) => digit === ""));

const closeToast = () => {
  isToastVisible.value = false;
};

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
      const resetUrl = response.url;

      const url = new URL(resetUrl);
      const path = url.pathname;
      const query = url.search;
      toastMessage.value = "OTP verified successfully";
      isToastVisible.value = true;
      setTimeout(() => {
        router.push({
          path,
          query: query ? Object.fromEntries(new URLSearchParams(query)) : {},
        });
      }, 1000);
    } else {
      toastMessage.value =
        response.message || "Verification failed. Please try again.";
      isToastVisible.value = true;
    }
  } catch (error: any) {
    toastMessage.value =
      error.response._data.message || "Verification failed. Please try again.";
    isToastVisible.value = true;
  }
};

onMounted(() => {
  form.value.email = email;
});
</script>
