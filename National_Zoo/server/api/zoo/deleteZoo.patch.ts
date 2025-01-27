import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const zooId = query.zooId;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/zoo/delete/${zooId}`;
  const results = await $fetch(apiUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return results;
});
