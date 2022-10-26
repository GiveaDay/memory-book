import {getProjectPath} from "./projectPath.mjs";
import fs from "fs";

export function readEnvironmentConfig() {
    let configFile = getProjectPath('data/.env')
    if (!fs.existsSync(configFile)) {
        throw new Error(`No config file found ${configFile}`)
    } else {
        let contents = fs.readFileSync(configFile, 'utf-8')
        let lines = contents.split(/\r?\n/)
        for (let line of lines) {
            line = line.trim()
            if (line !== '') {
                let parts = line.split('=')
                if (parts.length !== 2) {
                    throw new Error(`Could not parse line ${line} in file ${configFile}`)
                }
                process.env[parts[0]] = parts[1]
            }
        }
    }
}
