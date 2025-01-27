import userSession from "../util/user-session";

export default defineEventHandler(async (event) => {
  const userId = getQuery(event).userId;
  const formData = await readMultipartFormData(event);

  const forwardFormData = new FormData();

  formData?.forEach((field) => {
    if (field.name === "userUpdate") {
      const userData = field.data.toString("utf-8");

      forwardFormData.append("userUpdate", userData);
    } else if (field.name === "file" && field.type != undefined) {
      forwardFormData.append(
        "file",
        new Blob([field.data], { type: field.type }),
        field.name
      );
    }
  });

  const session = await userSession(event);

  const data = await $fetch<string>(
    `http://localhost:8080/auth/update/${userId}`,
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
