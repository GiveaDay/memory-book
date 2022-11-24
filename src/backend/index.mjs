import express from 'express'
import path from 'path'
import fs from 'fs'
import {expressjwt} from 'express-jwt'
import {getProjectPath} from "./utils/projectPath.mjs";
import {readEnvironmentConfig} from "./utils/jwt.mjs";
import router from './api/index.mjs'
import bodyParser from 'body-parser'
import {compileSassFiles} from "./utils/sass.mjs";

const start = new Date().getTime()

const app = express()
const port = 3030

readEnvironmentConfig()

let frontendDirectory = getProjectPath('src/frontend')
if (!fs.existsSync(frontendDirectory)) {
    throw new Error(`Could not find frontend directory. Path ${frontendDirectory} does not exist`)
}

app.use('/', express.static(frontendDirectory))

await compileSassFiles()

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDirectory, 'index.html'))
})

app.use(expressjwt({
    secret: process.env.jwt_secret,
    credentialsRequired: false,
    requestProperty: 'auth',
    algorithms: ['HS512'],
}).unless({path: []}))

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.text({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}))

app.use('/api', router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}. Starting the app took ${new Date().getTime() - start}ms`)
})
