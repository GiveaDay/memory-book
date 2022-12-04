class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

function handleResponse(url, response) {
    if (response.status === 200) {
        return response.json()
    } else {
        throw new HttpError(`Received response with status code ${response.status} for url ${url}`, response.status)
    }
}

function createHeaders() {
    let headers = {
        'Content-Type': 'application/json',
    }
    if (window.loginToken) {
        headers['Authorization'] = `Bearer ${window.loginToken}`
    }
    return headers;
}

export async function postToBackend(url, data, query) {
    let finalUrl = '/api' + url + new URLSearchParams(query);
    let response = await fetch(finalUrl, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
    })
    return handleResponse(finalUrl, response)
}

export async function getFromBackend(url, query) {
    let finalUrl = '/api' + url + new URLSearchParams(query);
    let response = await fetch(finalUrl, {
        method: 'GET',
        headers: createHeaders(),
    })
    return handleResponse(finalUrl, response)
}

export class AsyncFunctionResult {
    constructor() {
        this.active = false
        this.error = null
    }
}

export async function executeAsyncFunction(asyncFunctionResult, theFunction) {
    asyncFunctionResult.error = null
    asyncFunctionResult.active = true
    try {
        await theFunction()
    } catch (error) {
        asyncFunctionResult.error = error
    } finally {
        asyncFunctionResult.active = false
    }
}

export function saveLoginTokenToCookie(token) {
    document.cookie = "login_token=" + token
}

export function restoreLoginTokenFromCookie() {
    window.loginToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('login_token='))
        ?.split('=')[1];
}
