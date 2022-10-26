import {Router} from 'express'
import {inTransaction} from "./database.mjs";
import {handleError, handleResponse, NotAuthorizedError} from "./requestUtils.mjs";

export function createRouter(routes) {
    const router = Router()
    for (let route of routes) {
        let args = [route[1]]
        args.push(wrapRoute(router, route[2])) // Our implementation of the route
        router[route[0]].apply(router, args)
    }
    return router
}

function wrapRoute(router, requestHandler) {
    return async (request, response) => {
        try {
            request.loggedInUserId = getLoggedInUserId(request)
            let data = await inTransaction(async connection => {
                return requestHandler(connection, request, response)
            })
            assertAuthorizationChecked(request)
            handleResponse(data, response)
        } catch (error) {
            handleError(request, error, response)
        }
    }
}


export function getLoggedInUserId(request) {
    if (request.auth) {
        return request.auth.userId
    } else {
        return null
    }
}

function assertAuthorizationChecked(request) {
    if (!getAuthorizationChecked(request)) {
        throw new Error(`The router for ${request.originalUrl} did not check authorization of the request!`)
    }
}

export function getAuthorizationChecked(request) {
    return request.authorizationChecked
}

export function authorize(request, isAuthorized) {
    if (typeof isAuthorized !== 'boolean') {
        throw new Error(`Expected a boolean for 'isAuthorized', got a variable of type ${typeof isAuthorized}`)
    }
    if (!isAuthorized) {
        throw new NotAuthorizedError(`Request ${request.url} is not authorized`)
    }
    request.authorizationChecked = true
}

