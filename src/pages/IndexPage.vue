<template>
  <q-page class="flex flex-center">
    <q-card
      v-if="WalletState.address"
    >
      <q-card-section>
        {{ WalletState.address }}
      </q-card-section>

      <q-card-section>
        {{ TerraState.balances.uluna }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'
import {useWallet} from 'boot/plugins/wallet/wallet'
import {useTerra} from 'boot/plugins/terra/terra'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const {WalletState} = useWallet()
    const {TerraState} = useTerra()
    return {
      WalletState,
      TerraState
    }
  }
})
</script>
