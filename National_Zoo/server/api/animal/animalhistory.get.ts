import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const animalId = getQuery(event).animalId;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/animal/history/${animalId}`;
  const results = await $fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
