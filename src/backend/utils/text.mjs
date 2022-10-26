/**
 * Convert a value such as my-name or my_name to myName
 */
export function toCamelCase (name, firstLetterToUpperCase = false) {
    // Source: http://jsfiddle.net/brandonscript/1wz8a2td/
    let splittedName = name.split(/[_-]/)
    let result = ''
    for (let i = 1; i < splittedName.length; i++) {
        result += splittedName[i].charAt(0).toUpperCase() + splittedName[i].slice(1)
    }
    let finalResult = splittedName[0] + result
    if (firstLetterToUpperCase) {
        finalResult = finalResult.charAt(0).toUpperCase() + finalResult.substring(1)
    }
    return finalResult
}
