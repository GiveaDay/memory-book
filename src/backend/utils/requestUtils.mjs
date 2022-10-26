import {promises as fs} from "fs"
import {isSet} from "./data.mjs";

export const PAGE_NOT_FOUND_STATUS_CODE = 442 // Don't use 440!
export const USER_NOT_AUTHORIZED_STATUS_CODE = 403 // Don't use 401!
export const INTERNAL_SERVER_ERROR = 500 // Internal server error


export function requiredParam(request, name) {
    let result = optionalParam(request, name)
    if (!isSet(result)) {
        // Return 404 here. Usually these errors are caused by scrapers trying random inputs
        throw new PageNotFoundError(`You need to set the ${name} parameter. Request ${request.path} ${JSON.stringify(request.query)}`)
    }
    return result
}

export function requiredIntParam(request, name) {
    let paramValue = requiredParam(request, name)
    let result = parseInt(paramValue)
    if (isNaN(result)) {
        // Return 404 here. Usually these errors are caused by scrapers trying random inputs
        throw new PageNotFoundError(`The parameter ${name} has value ${paramValue}, this should be an integer`)
    }
    return result
}

export function requiredFloatParam(request, name) {
    return parseFloat(requiredParam(request, name))
}

export function requiredBoolParam(request, name) {
    let param = requiredParam(request, name)
    return parseBoolean(param)
}

export function requiredJsonParam(request, name) {
    let param = requiredParam(request, name)
    if (typeof param === 'string') {
        try {
            param = JSON.parse(param)
        } catch (exception) {
            let message = `Could not parse JSON value for parameter ${name}`
            console.error(message)
            // Return 404 here. Usually these errors are caused by scrapers trying random inputs
            throw new PageNotFoundError(message)
        }
    }
    return param
}

export function optionalParam(request, name) {
    if (request.body) {
        let value = request.body[name]
        if (isSet(value)) {
            return value
        }
    }
    let result = request.query[name]
    if (result === undefined) {
        result = null
    }
    return result
}

export function optionalIntParam(request, name) {
    let param = optionalParam(request, name)
    if (param) {
        param = parseInt(param)
    }
    return param
}

export function optionalFloatParam(request, name) {
    let param = optionalParam(request, name)
    if (param) {
        param = parseInt(param)
    }
    return param
}

export function optionalJsonParam(request, name) {
    let param = optionalParam(request, name)
    if (param && typeof param === 'string') {
        param = JSON.parse(param)
    }
    return param
}

function parseBoolean(param) {
    return param === true || param === 'true' || param === '1' || param === 1
}

export function optionalBoolParam(request, name) {
    let param = optionalParam(request, name)
    if (param) {
        param = parseBoolean(param)
    }
    return param
}

export function getIp(request) {
    let ip = request.headers['x-forwarded-for'] ||
        (request.connection && request.connection.remoteAddress) ||
        (request.socket && request.socket.remoteAddress) ||
        (request.connection && request.connection.socket && request.connection.socket.remoteAddress)
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0]
    }
    return ip
}

export function getLoggedInUserId(request) {
    if (request.auth) {
        if (request.auth.twoFaEnabled && !request.auth.twoFaSuccess) {
            return null
        }
        return request.auth.userId
    } else {
        return null
    }
}

function handleFileDownload(response, data) {
    response.download(data.path, data.filename, async error => {
        // Download has finished
        if (error) {
            log({level: 'error', msg: 'Received an error while downloading file', data, error})
        }
        if (data.deleteFileAfterDownload) {
            await fs.unlink(data.path)
        }
    })
}

export function returnJSON(data, response) {
    response.type('application/json')
    response.send(JSON.stringify(data))
    response.end()
}

function handleHtmlResponse(response, data) {
    response.type('text/html')
    response.send(data.html)
    response.end()
}

export function handleResponse(data, response) {
    if (data instanceof DownloadFileResponse) {
        handleFileDownload(response, data)
    } else if (data instanceof HTMLResponse) {
        handleHtmlResponse(response, data)
    } else {
        // Make sure we always return json
        returnJSON(data, response)
    }
}

export function handleError(request, error, response) {
    if (error instanceof ResponseError) {
        response.status(error.statusCode)
        response.send({error: error.errorKey, data: error.data})
    } else {
        console.error('Unexpected error', request.url, error)
        if (error.message && typeof error.message === 'string') {
            error = error.message
        }
        response.status(500).send({error})
    }

    response.end()
}

export class DownloadFileResponse {
    constructor(path, deleteFileAfterDownload = true, filename = null) {
        this.path = path
        this.deleteFileAfterDownload = deleteFileAfterDownload
        this.filename = filename
    }
}

export class HTMLResponse {
    constructor(html) {
        this.html = html
    }
}

export class ResponseError {
    constructor(errorKey, data = {}, statusCode = 500) {
        this.statusCode = statusCode
        this.errorKey = errorKey
        this.data = data
    }
}

export class PageNotFoundError extends ResponseError {
    constructor(errorMessage) {
        super(errorMessage, null, PAGE_NOT_FOUND_STATUS_CODE)
    }
}

export class NotAuthorizedError extends ResponseError {
    constructor(message) {
        super(message, {}, USER_NOT_AUTHORIZED_STATUS_CODE)
    }
}
