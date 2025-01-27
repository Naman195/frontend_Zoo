import userSession from "../util/user-session";

export default defineEventHandler(async (event) => {
  const session = await userSession(event);

  const data = await $fetch("http://localhost:8080/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  session.clear();
  return data;
});
