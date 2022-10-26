import {getDatabaseConnection} from "./utils/database.mjs";
import {getProjectPath} from "./utils/projectPath.mjs";

let db = await getDatabaseConnection()

db.migrate({migrationsPath: getProjectPath('./src/backend/database-migrations')})
