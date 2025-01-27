import userSession from "../../util/user-session";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const zooId = query.zooId;

  const session = await userSession(event);
  return await $fetch(`http://localhost:8080/animal/getzoolist/${zooId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
});
