export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });
  return await $fetch(`http://localhost:8080/category/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
});
