export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const zooId = query.zooId;
  try {
    const session = await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
    });
    return await $fetch(`http://localhost:8080/animal/getzoolist/${zooId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
    });
  } catch (error) {}
});
