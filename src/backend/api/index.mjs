import {fetchUser} from "./fetchUser.mjs";
import {createRouter} from "../utils/createRouter.mjs";
import {login} from "./login.mjs";


const allRoutes = [
    ['post', '/login', login],
    ['get', '/fetchUser', fetchUser],
]

export default createRouter(allRoutes)
