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
  
  <script setup>
  import "../assests/css/Otpverify.css";
  
  const form = ref({
    email: "",
    otp: ""
  });
  
  const otpArray = ref(new Array(5).fill('')); 
  const isDisabled = computed(() => otpArray.value.some((digit) => digit === '')); 
  

  const moveFocus = (index, event) => {
    const input = event.target;
    if (input.value && index < otpArray.value.length - 1) {
      const nextInput = input.nextElementSibling;
      nextInput?.focus();
    }
  };
  
  const route = useRoute();
  const router = useRouter();
  const email = route.query.email;
  
  onMounted(() => {
    form.value.email = email;
    console.log('Email for OTP verification:', form.value.email);
  });
  
  const submitOtp = async () => {
  form.value.otp = otpArray.value.join(''); 
  // console.log('Submitted OTP:', form.value.otp);

  try {
    const response = await useCustomFetch("/auth/verifyotp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value) 
    });

  
    
        if (response.message === "OTP verified successfully") {
        const resetUrl = response.url;

        const url = new URL(resetUrl);
        const path = url.pathname;
        const query = url.search;


        router.push({ path, query: query ? Object.fromEntries(new URLSearchParams(query)) : {} });
    } else {
      alert(response.message || "Verification failed. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred: " + error);
    alert("An error occurred during OTP verification. Please try again.");
  }
};
  </script>
  
  <style></style>