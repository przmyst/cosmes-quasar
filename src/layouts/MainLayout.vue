<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          CosmES Quasar
        </q-toolbar-title>

        <div>
          <q-btn
            label="Connect Wallet"
            @click="ConnectWallet"
            v-if="!WalletState.isConnected"
            />
          <q-btn
            label="Disconnect"
            @click="DisconnectWallet"
            v-if="WalletState.isConnected"
          />
        </div>
      </q-toolbar>
    </q-header>

    <WalletDialog/>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent} from 'vue'
import {useWallet} from 'boot/plugins/wallet/wallet'
import WalletDialog from 'components/Wallet.vue'
import {useTerra} from 'boot/plugins/terra/terra'
import {LCDClient} from '@terra-money/terra.js'

export default defineComponent({
  name: 'MainLayout',
  components: {WalletDialog},

  setup () {

    const { WalletState, ConnectWallet, DisconnectWallet } = useWallet()
    const {InjectTerra} = useTerra()

    InjectTerra(LCDClient)

    return {
      ConnectWallet,
      DisconnectWallet,
      WalletState
    }
  }
})
</script>
