export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const { token, refreshToken, userId, username } = query;

  const session = await useSession(event, {
    password: "80d42cfb-1cd2-462c-8f17-e3237d9027e9",
  });

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
  });

  return sendRedirect(event, `/dashboard?userId=${userId}`, 302);
});
