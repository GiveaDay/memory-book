import CenteredBox from "../components/centered-box/index.js";
import Spinner from "../components/spinner/index.js";
import AsyncButton from "../components/async-button/index.js";

export default {
    template: `
      <centered-box>
      <h1>Register</h1>
      <form @submit="doLogin">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Fill in your email">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Fill in your password">
        TODO
      </form>
      </centered-box>
    `,
    components: {CenteredBox, Spinner, AsyncButton},
    data() {
        return {
            email: null,
            password: null,
        }
    },
}
