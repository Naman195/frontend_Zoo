import { userLogin } from "~/types/userLogin";
import userSession from "../util/user-session";

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

  const session = await userSession(event);

  await session.update({
    token: data.token,
    refreshToken: data.refreshToken,
    userId: data.userId,
  });

  console.log(session.data.token);

  return data;
});
