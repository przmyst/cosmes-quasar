import useTopics from 'boot/plugins/topics/topics'
import {
	initProvider
} from 'boot/util/DI'
import {
	pipe
} from 'ramda'
import {
	reactive
} from 'vue'
import {
	filter,
	take,
	tap
} from 'rxjs/operators'

import {
	interval
} from 'rxjs'
import {
	CONTROLLERS, getGasPrice, getRpc
} from 'boot/util/cosmes'

const [WalletSymbol, useWallet] = initProvider('WalletSymbol')

const createWallet = () => {

	const WalletState = reactive({
		loading: false,
		isConnected: false,
		address: '',
		showDialog: false
	})

	const {
		Topic,
		Message
	} = useTopics

	async function Connect(type = 'station', chainIds = ['columbus-5'], controller_type = 'station') {
		try {
			const chainInfos = chainIds.map((chainId) => ({
				chainId,
				rpc: getRpc(chainId),
				gasPrice: getGasPrice(chainId),
			}))

			const controller = await CONTROLLERS[controller_type].connect(type, chainInfos)

			const wallet = controller.get('columbus-5')

			Message('wallet', 'account', wallet)

			localStorage.setItem('cosmes-type', type)
			localStorage.setItem('cosmes-controller', controller_type)
		} catch (e) {
			console.log(e)
		}
	}

	const Init = () => {
		if (window.station) {
			for (const controller of Object.values(CONTROLLERS)) {
				controller.onDisconnect(wallets => Message('wallet', 'disconnected', wallets[0]))
				controller.onAccountChange(wallets => Message('wallet', 'account', wallets[0]))
			}

			if (localStorage.getItem('cosmes-type')) {
				Connect(
					localStorage.getItem('cosmes-type'),
					['columbus-5'],
					localStorage.getItem('cosmes-controller'))
					.catch(console.log)
			}
		}
	}

	const ConnectWallet = async (controller) => {
		WalletState.loading = true
		WalletState.showDialog = true
		Init()
	}

	Topic('wallet', 'account')
		.pipe(tap(account => {
			console.log(account.address)
			WalletState.address = account.address
			WalletState.loading = false
			WalletState.isConnected = true
		}))
		.subscribe(console.log)

	Topic('wallet', 'selected')
		.pipe(tap(controller => {
			if (controller === 'walletconnect') {
				Connect('walletconnect', ['columbus-5'], 'station').catch(console.log)
			} else {
				Connect('extension', ['columbus-5'], controller).catch(console.log)
			}
		}))
		.subscribe()

	const DisconnectWallet = async () => {
		localStorage.removeItem('cosmes-type')
		localStorage.removeItem('cosmes-controller')
		WalletState.address = ''
		WalletState.isConnected = false
	}

	interval(10)
		.pipe(filter(() => window.station !== undefined))
		.pipe(take(1))
		.pipe(tap(Init))
		.subscribe()

	return {
		WalletState,
		ConnectWallet,
		DisconnectWallet
	}
}

const provideWallet = pipe(createWallet, WalletSymbol)

export {
	provideWallet, useWallet
}
