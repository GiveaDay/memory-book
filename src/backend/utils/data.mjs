export function isArray (value) {
    return isSet(value) && typeof value === 'object' && isSet(value.length)
}

export function isSet (value) {
    return value !== null && value !== undefined
}

export function convertAllDatesToDateObjects (data) {
    if (typeof data === 'string') {
        if (data.match(/^\d{4}-\d{2}-\d{2}.*$/) && data.endsWith('Z') && data.indexOf('T') > 0) {
            try {
                return new Date(data)
            } catch (exception) {
                return data
            }
        }
    } else if (isSet(data) && typeof data === 'object') {
        for (let key of Object.keys(data)) {
            data[key] = convertAllDatesToDateObjects(data[key])
        }
    }
    return data
}
