import {getFromBackend} from "../js/utils.js";
import LoadAsync from "../components/load-async/index.js";

export default {
    // language=vue
    template: `
      <load-async :async-function="loadUser">
      <template v-if="user">
        Hello {{user.firstName}}
      </template>
      <template v-else-if="loadedUser">
        Please login to continue
      </template>
      </load-async>`,
    components: {LoadAsync},
    data() {
        return {
            user: null,
            loadedUser: false,
        }
    },
    methods: {
        async loadUser() {
            if (window.loginToken) {
                this.user = await getFromBackend('/fetchUser')
            }
            this.loadedUser = true
        },
    },
}
