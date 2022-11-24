import CenteredBox from "../components/centered-box/index.js";
import Spinner from "../components/spinner/index.js";
import AsyncButton from "../components/async-button/index.js";
import {postToBackend} from "../js/utils.js";

export default {
    // language=vue
    template: `
      <centered-box>
      <h1>Log in</h1>
      <form @submit="doLogin">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Fill in your email">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Fill in your password">
        <div class="error-text" v-if="incorrectEmailOrPassword">
          Incorrect email or password
        </div>
        <async-button type="submit" :async-function="doLogin">Log in</async-button>
      </form>
      </centered-box>
    `,
    components: {CenteredBox, Spinner, AsyncButton},
    data() {
        return {
            email: null,
            password: null,
            incorrectEmailOrPassword: false,
        }
    },
    methods: {
        async doLogin() {
            try {
                this.incorrectEmailOrPassword = false
                window.loginToken = await postToBackend('/login', {email: this.email, password: this.password})
                this.$router.push('/')
            } catch (error) {
                if (error.statusCode === 401) {
                    this.incorrectEmailOrPassword = true
                } else {
                    // Unexpected error
                    throw error
                }
            }
        },
    },
}
