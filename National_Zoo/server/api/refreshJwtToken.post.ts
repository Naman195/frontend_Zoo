import { ref } from "vue";
const newJwtToken = ref("");
export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const refreshToken = session.data.refreshToken;

  try {
    const data: any = await $fetch("http://localhost:8080/auth/refresh", {
      method: "POST",
      body: { refreshtoken: refreshToken },
    });
    newJwtToken.value = data;
  } catch (error: any) {
    await session.clear();
    return "session expired";
  }

  await session.update({
    token: newJwtToken.value,
  });

  return "abc";
});
