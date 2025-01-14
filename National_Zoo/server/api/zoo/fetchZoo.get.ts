export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page;
  const size = query.size;

  try {
    const session = await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
    });

    const apiUrl = `http://localhost:8080/zoo/fetchall?page=${page}&size=${size}`;
    const results = await $fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
    });

    console.log("In Zoo fetch", session.data.token);

    return results;
  } catch (error) {}
});
