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
	filter, take, tap
} from 'rxjs/operators'

import {
	from,
	interval
} from 'rxjs'
import {
	chainInfos,
	CONTROLLERS
} from 'boot/util/cosmes'
import {
	switchMap
} from 'rxjs'
import Logger from 'boot/util/Logger$'

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

	async function Connect(controller_type, connection_type) {

		const controller = await CONTROLLERS[connection_type].connect(controller_type, chainInfos)

		const wallet = controller.get('columbus-5')

		localStorage.setItem('cosmes-type', controller_type)
		localStorage.setItem('cosmes-controller', connection_type)

		Message('wallet', 'account', wallet)

		return `${controller_type} ${connection_type}`
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
					localStorage.getItem('cosmes-controller'))
					.catch(console.log)
			}
		}
	}

	const ConnectWallet = () => {
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
		.pipe(switchMap(connection_type => {
			if (connection_type === 'walletconnect') {
				return from(Connect('walletconnect', 'station'))
			} else {
				return from(Connect('extension', connection_type))
			}
		}))
		.subscribe(Logger('Wallet Selected', true))

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
