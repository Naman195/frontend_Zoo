export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const forwardFormData = new FormData();

  formData?.forEach((field) => {
    if (field.name === "zoo") {
      const userData = field.data.toString("utf-8");

      forwardFormData.append("zoo", userData);
    } else if (field.name === "file" && field.type != undefined) {
      forwardFormData.append(
        "file",
        new Blob([field.data], { type: field.type }),
        field.filename
      );
    }
  });

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

  const data = await $fetch<string>("http://localhost:8080/zoo/add", {
    method: "POST",
    body: forwardFormData,
    headers: {
      Authorization: `Bearer ${session.data.token}`,
    },
  });
  return data;
});
