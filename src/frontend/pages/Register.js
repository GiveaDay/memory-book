import CenteredBox from "../components/centered-box/index.js";
import Spinner from "../components/spinner/index.js";
import AsyncButton from "../components/async-button/index.js";
import {postToBackend, saveLoginTokenToCookie} from "../js/utils.js";

export default {
    template: `
      <centered-box>
      <h1>Register</h1>
      <form @submit="doRegister">
        <label>First name</label>
        <input type="text" v-model="firstName" placeholder="Fill in your first name">
        <label>Family name</label>
        <input type="text" v-model="lastName" placeholder="Fill in your family name">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Fill in your email">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Fill in your password">
        <div class="error-text" v-if="emailTaken">
          A user account already exists for this email
        </div>
        <async-button type="submit" :async-function="doRegister">Register</async-button>
      </form>
      </centered-box>
    `,
    components: {CenteredBox, Spinner, AsyncButton},
    data() {
        return {
            email: null,
            password: null,
            firstName: null,
            lastName: null,
            emailTaken: false,
        }
    },
    methods: {
        async doRegister() {
            try {
                this.emailTaken = false
                let data = {
                    email: this.email,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName,
                };
                window.loginToken = await postToBackend('/register', data)
                saveLoginTokenToCookie(window.loginToken)
                this.$router.push('/')
            } catch (error) {
                if (error.statusCode === 401) {
                    this.emailTaken = true
                } else {
                    // Unexpected error
                    throw error
                }
            }
        },
    },
}
