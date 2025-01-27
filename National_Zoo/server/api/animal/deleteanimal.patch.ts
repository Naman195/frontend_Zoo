import userSession from "../../util/user-session";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const animalId = query.animalId;

  const session = await userSession(event);

  const apiUrl = `http://localhost:8080/animal/delete/${animalId}`;
  const results = await $fetch(apiUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });

  return results;
});
