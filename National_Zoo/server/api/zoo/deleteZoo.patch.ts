export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const zooId = query.zooId;

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const apiUrl = `http://localhost:8080/zoo/delete/${zooId}`;
  const results = await $fetch(apiUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return results;
});
