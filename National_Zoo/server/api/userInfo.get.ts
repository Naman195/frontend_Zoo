// export default defineEventHandler(async (event) => {
//   try {
//     const authorization = getRequestHeaders(event);
//     console.log("Headers info", authorization);
//     const headerCookie = getRequestHeader(event, "cookie");
//     console.log("headerCookie", headerCookie);

//     const response = await $fetch("http://localhost:8080/auth/user-info", {
//       method: "GET",
//       header: authorization,

//       credentials: "include",
//     });
//     return response;
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: "Internal Server Error",
//     });
//   }
// });
