import {authorize} from "../utils/createRouter.mjs";
import {requiredParam, ResponseError} from "../utils/requestUtils.mjs";
import {hashPassword, loginUser} from "../utils/auth.mjs";

export async function register(connection, request) {
    let email = requiredParam(request, 'email')
    let password = requiredParam(request, 'password')
    let firstName = requiredParam(request, 'firstName')
    let lastName = requiredParam(request, 'lastName')

    authorize(request, true)

    let user = await connection.querySingle('select * from user where email=?', [email])

    if (user) {
        throw new ResponseError('existing_user', {}, 401)
    }

    let hashedPassword = await hashPassword(password)

    let {insertId: userId} = await connection.query('insert into user (email, passwd, first_name, last_name) values (?, ?, ?, ?)', [email, hashedPassword, firstName, lastName])

    return loginUser(connection, userId)
}
