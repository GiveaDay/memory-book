import {authorize} from "../utils/createRouter.mjs";

export async function fetchUser(connection, request) {
    authorize(request, !!request.loggedInUserId)

    return await connection.querySingle('select id, email, first_name, last_name from user where id=?', [request.loggedInUserId])
}
