export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const data = await $fetch("http://localhost:8080/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  session.clear();
  return data;
});
