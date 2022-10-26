import path from "path";

export function getProjectPath(pathRelativeToProjectRoot) {
    let moduleURL = new URL(import.meta.url)
    return path.join(path.join(path.dirname(moduleURL.pathname), '../../../'), pathRelativeToProjectRoot)
}
