export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    const forwardFormData = new FormData();

    formData?.forEach((field) => {
      if (field.name === "user") {
        const userData = field.data.toString("utf-8");

        forwardFormData.append("user", userData);
      } else if (field.name === "file" && field.type != undefined) {
        forwardFormData.append(
          "file",
          new Blob([field.data], { type: field.type }),
          field.name
        );
      }
    });

    const data = await $fetch<string>(`http://localhost:8080/auth/create`, {
      method: "POST",
      body: forwardFormData,
    });

    return data;
  } catch (error: any) {
    throw error.data.message;
  }
});
