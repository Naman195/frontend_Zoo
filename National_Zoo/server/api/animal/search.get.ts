import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.searchTerm as string | undefined;
    const zooId = query.zooId as string | undefined;

    console.log("Received Query Parameters:", { searchTerm, zooId });

    if (!searchTerm || !zooId) {
      console.error("Missing required parameters.");
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Missing required parameters: searchTerm or zooId.",
      });
    }

    const session = await useSession(event, {
      password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
    });

    console.log("Session Retrieved:", session.data);

    if (!session || !session.data.token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid or missing session token.",
      });
    }

    const apiUrl = `http://localhost:8080/animal/search?searchTerm=${encodeURIComponent(
      searchTerm
    )}&zooId=${encodeURIComponent(zooId)}`;
    const results = await $fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
    });

    return results;
  } catch (error: any) {
    console.error("Error in API handler:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message || "An unexpected error occurred.",
    });
  }
});
