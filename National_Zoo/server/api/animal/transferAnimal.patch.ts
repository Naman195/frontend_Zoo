import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const newZooId = query.newZooId;
  const animalId = query.animalId;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/animal/transfer/${animalId}/to/${newZooId}`;
  const results = await $fetch(apiUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
