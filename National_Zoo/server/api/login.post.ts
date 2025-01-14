import { userLogin } from "~/types/userLogin";
interface form {
  username: string | "";
  password: string | "";
}
export default defineEventHandler(async (event) => {
  const body: form = await readBody(event);

  const data = await $fetch<userLogin>("http://localhost:8080/auth/login", {
    method: "POST",
    body: {
      username: body.username,
      password: body.password,
    },
  });

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  await session.update({
    token: data.token,
    refreshToken: data.refreshToken,
  });

  console.log("Session Data", session.data);

  return data;
});
