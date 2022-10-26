import {authorize} from "../utils/createRouter.mjs";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {requiredParam, ResponseError} from "../utils/requestUtils.mjs";

export async function login(connection, request) {
    let email = requiredParam(request, 'email')
    let password = requiredParam(request, 'password')

    authorize(request, true)

    let user = await connection.querySingle('select * from user where email=?', [email])

    if (!user || !await samePassword(password, user.passwd)) {
        throw new ResponseError('validation_incorrect_email_or_password', {}, 401)
    }

    let loginId = Math.round(Math.random() * 10000000)

    await connection.query('update user set login_id=? where id=?', [loginId, user.id])

    return generateAuthToken(user.id, loginId)
}

export async function hashPassword(plaintextPassword) {
    let saltRounds = parseInt(process.env.password_hash_rounds)
    return await bcrypt.hash(plaintextPassword, saltRounds)
}

export async function samePassword(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword || '')
}

export function generateAuthToken(userId, loginId) {
    // Generate a relatively short lived token that is used to authenticate all requests to the backend
    return jwt.sign({userId, loginId}, process.env.jwt_secret, {algorithm: 'HS512', expiresIn: '6 weeks'})
}
