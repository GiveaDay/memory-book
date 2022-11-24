import sass from 'sass-embedded'
import {getProjectPath} from "./projectPath.mjs";
import fs from 'fs'
import path from 'path'

async function convertSassFilesToCss(sassDir) {
    let files = fs.readdirSync(sassDir)
    let css = ''
    for (let file of files) {
        if (file === 'node_modules') {
            continue
        }
        let completePath = path.join(sassDir, file);
        if (file.endsWith('.scss')) {
            const result = await sass.compileAsync(completePath);
            css += result.css + '\n'
        } else if (fs.statSync(completePath).isDirectory()) {
            css += await convertSassFilesToCss(completePath)
        }
    }
    return css;
}

export async function compileSassFiles() {
    let sassDir = getProjectPath('src/frontend/')
    let allCss = await convertSassFilesToCss(sassDir);
    fs.writeFileSync(getProjectPath('src/frontend/generated/style.css'), allCss, {encoding: "utf-8"})
}
