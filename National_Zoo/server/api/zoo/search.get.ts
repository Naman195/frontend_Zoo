export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.searchQuery;

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const apiUrl = `http://localhost:8080/zoo/search?searchItem=${searchQuery}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return results;
});
