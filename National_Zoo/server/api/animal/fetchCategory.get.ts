import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const session = await userSession(event);
  return await $fetch(`http://localhost:8080/category/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
});
