export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const animalId = query.animalId;
  try {
    console.log("Received Query Parameters in delte animal:", { animalId });

    const session = await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
    });

    const apiUrl = `http://localhost:8080/animal/delete/${animalId}`;
    const results = await $fetch(apiUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
    });

    console.log(results);
    return results;
  } catch (error) {}
});
