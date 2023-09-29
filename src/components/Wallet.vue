<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" v-model="WalletState.showDialog">
    <q-card class="q-dialog-plugin">

      <q-card-actions align="center" class="q-gutter-lg">
        <q-btn
          color="primary"
          label="Station Extension"
          @click="onOKClick('station')"

        />

        <q-btn
          color="primary"
          label="Wallet Connect"
          @click="onOKClick('walletconnect')"

        />

        <q-btn
          color="primary"
          label="Keplr"
          @click="onOKClick('keplr')"
        />

      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {useDialogPluginComponent} from 'quasar'
import {useWallet} from 'boot/plugins/wallet/wallet'
import useTopics from 'boot/plugins/topics/topics'

export default {
  name: "WalletDialog",

  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup() {
    const {Message} = useTopics

    const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()


    const {WalletState} = useWallet()

    return {
      WalletState,
      dialogRef,
      onDialogHide,

      onOKClick(wallet) {
        Message('wallet', 'selected', wallet)
        onDialogOK()
      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>
