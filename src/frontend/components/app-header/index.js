export default {
    // language=vue
    template: `
      <header>
      <router-link to="/" class="site-name">
        Memory book
      </router-link>

      <div class="actions">
        <router-link to="/register" custom v-slot="{ navigate }" v-if="$route.path!=='/register'">
          <button @click="navigate" role="link">Register</button>
        </router-link>
        <router-link to="/login" custom v-slot="{ navigate }" v-if="$route.path!=='/login'">
          <button @click="navigate" role="link">Log in</button>
        </router-link>
      </div>
      </header>
    `,
}
