export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

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
