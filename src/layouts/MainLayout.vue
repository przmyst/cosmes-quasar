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
import { defineComponent, ref } from 'vue'
import {useWallet} from "boot/plugins/wallet/wallet";
import WalletDialog from "components/Wallet.vue";

export default defineComponent({
  name: 'MainLayout',
  components: {WalletDialog},

  setup () {

    const { WalletState, ConnectWallet, DisconnectWallet } = useWallet()

    return {
      ConnectWallet,
      DisconnectWallet,
      WalletState
    }
  }
})
</script>
