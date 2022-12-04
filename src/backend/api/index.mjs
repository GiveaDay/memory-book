import {fetchUser} from "./fetchUser.mjs";
import {createRouter} from "../utils/createRouter.mjs";
import {login} from "./login.mjs";
import {register} from "./register.mjs";


const allRoutes = [
    ['post', '/login', login],
    ['get', '/fetchUser', fetchUser],
    ['post', '/register', register],
]

export default createRouter(allRoutes)
