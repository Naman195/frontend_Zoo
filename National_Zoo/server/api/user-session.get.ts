import { jwtDecode } from "jwt-decode";
import userSession from "../util/user-session";

export default defineEventHandler(async (event) => {
  const session = await userSession(event);

  console.log("Toke", session.data.token);

  if (session.data.token) {
    const token = session.data.token;

    const decodeToken = jwtDecode(token);
    console.log("decodeToken", decodeToken);

    return decodeToken;
  }
});
