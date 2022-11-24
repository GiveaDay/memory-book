import {AsyncFunctionResult, executeAsyncFunction} from "../../js/utils.js";
import Spinner from "../spinner/index.js";
import ErrorText from "../error-text/index.js";

export default {
    // language=vue
    template: `
      <spinner v-if="asyncFunctionResult.active"/>
      <error-text :error="asyncFunctionResult.error"/>
      <slot/>
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
    async mounted() {
        await executeAsyncFunction(this.asyncFunctionResult, this.asyncFunction)
    },
}
