<template>
  <router-view/>
</template>

<script>
import {defineComponent} from 'vue'
import {provideWallet} from 'boot/plugins/wallet/wallet'
import _process from 'boot/polyfills/process-es6.js'
import buffer from 'buffer'
import {provideTerra} from 'boot/plugins/terra/terra'

window.Buffer = buffer.Buffer
window.process = _process


export default defineComponent({
  name: 'App',
  setup() {
    provideWallet()
    provideTerra()
  }
})
</script>
