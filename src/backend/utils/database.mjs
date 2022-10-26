import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

/**
 * Usage:
 *
 * await inTransaction(connection => {
 *   ... do queries and updates
 * })
 */
import {ConnectionWrapper} from "./ConnectionWrapper.mjs";
import {getProjectPath} from "./projectPath.mjs";

export async function inTransaction(func) {
    return await withConnection(async connection => {
        try {
            await connection.exec('BEGIN TRANSACTION')
            let result = await func(new ConnectionWrapper(connection))
            await connection.exec('COMMIT')
            return result
        } catch (error) {
            await connection.exec('ROLLBACK')
            throw error
        }
    }, false)
}

/**
 * Usage:
 *
 * await withConnection(connection => {
 *   ... do queries and updates
 * })
 */
export async function withConnection(func, wrapConnection = true) {
    let connection = await getDatabaseConnection()
    try {
        return await func(wrapConnection ? new ConnectionWrapper(connection) : connection)
    } finally {
        await connection.close()
    }
}

export async function getDatabaseConnection() {
    return await open({
        filename: getProjectPath('data/sqlite_database.db'),
        driver: sqlite3.Database,
    })
}
