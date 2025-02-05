import userSession from "../../util/user-session";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const { token, refreshToken, userId, username } = query;

  const session = await userSession(event);

  if (!token || !refreshToken) {
    throw createError({
      statusCode: 400,
      message: "Missing authentication data",
    });
  }

  console.log("JWT Token:", token);
  console.log("Refresh Token:", refreshToken);
  console.log("User ID:", userId);
  console.log("Username:", username);

  await session.update({
    token: token,
    refreshToken: refreshToken,
    userId: userId,
  });

  return sendRedirect(event, `/?userId=${userId}`, 302);
});
