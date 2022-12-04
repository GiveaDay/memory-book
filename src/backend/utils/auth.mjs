import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function loginUser(connection, userId) {
    let loginId = Math.round(Math.random() * 10000000)

    await connection.query('update user set login_id=? where id=?', [loginId, userId])

    return generateAuthToken(userId, loginId)
}

export async function hashPassword(plaintextPassword) {
    let saltRounds = parseInt(process.env.password_hash_rounds)
    return await bcrypt.hash(plaintextPassword, saltRounds)
}

export async function samePassword(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword || '')
}

export function generateAuthToken(userId, loginId) {
    // Generate a relatively short-lived token that is used to authenticate all requests to the backend
    return jwt.sign({userId, loginId}, process.env.jwt_secret, {algorithm: 'HS512', expiresIn: '6 weeks'})
}
