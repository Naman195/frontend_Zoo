import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const animalId = getQuery(event).animalId;
  const formData = await readMultipartFormData(event);

  const forwardFormData = new FormData();

  formData?.forEach((field) => {
    if (field.name === "animal") {
      const userData = field.data.toString("utf-8");

      forwardFormData.append("animal", userData);
    } else if (field.name === "file" && field.type != undefined) {
      forwardFormData.append(
        "file",
        new Blob([field.data], { type: field.type }),
        field.filename
      );
    }
  });

  const session = await userSession(event);

  const data = await $fetch<string>(
    `http://localhost:8080/animal/update/${animalId}`,
    {
      method: "PATCH",
      body: forwardFormData,
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
    }
  );

  return data;
});
