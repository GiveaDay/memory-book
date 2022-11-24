export default {
    // language=vue
    template: `
      <div class="error-text" v-if="errorText">
      {{errorText}}
      </div>`,
    props: {
        error: {},
    },
    computed: {
        errorText() {
            if (!this.error) {
                return null
            } else {
                return `${this.error}`
            }
        },
    },
}
