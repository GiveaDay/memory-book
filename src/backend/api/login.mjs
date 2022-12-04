import {authorize} from "../utils/createRouter.mjs";
import {requiredParam, ResponseError} from "../utils/requestUtils.mjs";
import {loginUser, samePassword} from "../utils/auth.mjs";

export async function login(connection, request) {
    let email = requiredParam(request, 'email')
    let password = requiredParam(request, 'password')

    authorize(request, true)

    let user = await connection.querySingle('select * from user where email=?', [email])

    if (!user || !await samePassword(password, user.passwd)) {
        throw new ResponseError('validation_incorrect_email_or_password', {}, 401)
    }
    return await loginUser(connection, user.id);
}
