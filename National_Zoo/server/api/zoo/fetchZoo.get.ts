import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page;
  const size = query.size;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/zoo/fetchall?page=${page}&size=${size}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
