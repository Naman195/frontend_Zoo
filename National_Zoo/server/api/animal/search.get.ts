import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = query.searchQuery as string | undefined;
  const zooId = query.zooId as string | undefined;

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const apiUrl = `http://localhost:8080/animal/search?searchTerm=${searchQuery}&zooId=${zooId}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
