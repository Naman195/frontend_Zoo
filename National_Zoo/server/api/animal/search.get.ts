import { defineEventHandler, getQuery } from "h3";
import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.searchQuery as string | undefined;
  const zooId = query.zooId as string | undefined;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/animal/search?searchTerm=${searchQuery}&zooId=${zooId}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
