import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Extract query parameters
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
    

    const apiUrl = `http://localhost:8080/animal/search?searchTerm=${encodeURIComponent(searchTerm)}&zooId=${encodeURIComponent(zooId)}`;
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



// ...........................................................................


// import { defineEventHandler, readMultipartFormData, createError } from "h3";
// // import { $fetch } from "ohmyfetch";

// export default defineEventHandler(async (event) => {
//   try {
//     console.log("Start processing request");

//     // Parse the incoming multipart form data
//     const formData = await readMultipartFormData(event);
//     console.log("formData Body", formData);
//     console.log("Type of form data", typeof formData);
    

//     // Prepare the FormData to send to the Spring Boot backend
//     const forwardFormData = new FormData();
//     formData?.forEach((field) => {
//       console.log(`Field: ${field.name}, Type: ${field.type}`);
//       if (field.name === "user") {
//         const userData = field.data.toString("utf-8");
//         console.log("Parsed user data:", userData);
//         forwardFormData.append("user", new Blob([userData], { type: "application/json" }));
//       } else if (field.name === "file") {
//         forwardFormData.append(
//           "file",
//           new Blob([field.data], { type: field.type }),
//           field.filename
//         );
//       }
//     });

//     // Forward the request to the Spring Boot backend
//     const response = await $fetch("http://localhost:8080/auth/create", {
//       method: "POST",
//       body: forwardFormData,
//     });

//     // Return the backend response
//     return response;
//   } catch (error: any) {
//     console.error("Error forwarding request:", error);
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.statusMessage || "Internal Server Error",
//     });
//   }
// });