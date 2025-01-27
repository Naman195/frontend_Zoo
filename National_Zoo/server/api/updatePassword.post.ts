import userSession from "../util/user-session";

export default defineEventHandler(async (event) => {
  const session = await userSession(event);

  const body1 = await readBody(event);

  const data = await $fetch("http://localhost:8080/auth/updatepassword", {
    method: "POST",
    body: body1,
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return data;
});
