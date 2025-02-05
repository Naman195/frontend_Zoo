import userSession from "../util/user-session";

export default defineEventHandler(async (event) => {
  const session = await userSession(event);
  const userId = session.data.userId;
  console.log("UserId is", userId);

  const data = await $fetch(`http://localhost:8080/auth/${userId}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  console.log("User profile Data", data);

  return data;
});
