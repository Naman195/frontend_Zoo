import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.searchQuery;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/zoo/search?searchItem=${searchQuery}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return results;
});
