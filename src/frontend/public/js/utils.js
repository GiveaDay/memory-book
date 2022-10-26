function handleResponse(url, response) {
    if (response.status === 200) {
        return response.json()
    } else {
        throw new Error(`Received response with status code ${response.status} for url ${url}`)
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

async function postToBackend(url, data, query) {
    let finalUrl = '/api' + url + new URLSearchParams(query);
    let response = await fetch(finalUrl, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
    })
    return handleResponse(finalUrl, response)
}

async function getFromBackend(url, query) {
    let finalUrl = '/api' + url + new URLSearchParams(query);
    let response = await fetch(finalUrl, {
        method: 'GET',
        headers: createHeaders(),
    })
    return handleResponse(finalUrl, response)
}
