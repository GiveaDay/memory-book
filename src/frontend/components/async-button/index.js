import {AsyncFunctionResult, executeAsyncFunction} from "../../js/utils.js";
import Spinner from "../spinner/index.js";
import ErrorText from "../error-text/index.js";

export default {
    // language=vue
    template: `
      <button @click="executeFunction">
      <slot/>
      </button>
      <spinner v-if="asyncFunctionResult.active"/>
      <error-text :error="asyncFunctionResult.error"/>
    `,
    components: {Spinner, ErrorText},
    props: {
        asyncFunction: {type: Function, required: true},
    },
    data() {
        return {
            asyncFunctionResult: new AsyncFunctionResult(),
        }
    },
    methods: {
        async executeFunction() {
            return await executeAsyncFunction(this.asyncFunctionResult, this.asyncFunction)
        },
    },
}
