<template>
  <q-page class="flex flex-center">
    <q-card
      v-if="WalletState.address"
    >
      <q-card-section>
        {{ WalletState.address }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {useWallet} from "boot/plugins/wallet/wallet";

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const {WalletState} = useWallet()

    return {
      WalletState
    }
  }
})
</script>
