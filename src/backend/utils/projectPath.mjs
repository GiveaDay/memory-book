import path from "path";
import {fileURLToPath} from 'url'

export function getProjectPath(pathRelativeToProjectRoot) {
    let modulePath = fileURLToPath(import.meta.url)
    return path.join(path.join(path.dirname(modulePath), '../../../'), pathRelativeToProjectRoot)
}
