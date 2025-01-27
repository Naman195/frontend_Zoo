import userSession from "../util/user-session";
import { ref } from "vue";
const newJwtToken = ref("");
export default defineEventHandler(async (event) => {
  const session = await userSession(event);
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
