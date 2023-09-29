import {
	CosmostationController,
	KeplrController,
	LeapController,
	StationController,
	WalletName,
	WalletType,
} from 'cosmes/wallet'

const WC_PROJECT_ID = '2b7d5a2da89dd74fed821d184acabf95'

export const CHAINS = {
	'osmosis-1': 'Osmosis',
	'juno-1': 'Juno',
	'kaiyo-1': 'Kujira',
	'phoenix-1': 'Terra',
	'columbus-5': 'Terra Classic',
	'neutron-1': 'Neutron',
}
export const WALLETS = {
	[WalletName.KEPLR]: 'Keplr',
	[WalletName.COSMOSTATION]: 'Cosmostation',
	[WalletName.STATION]: 'Terra Station',
	[WalletName.LEAP]: 'Leap',
}
export const TYPES = {
	[WalletType.EXTENSION]: 'Extension',
	[WalletType.WALLETCONNECT]: 'Wallet Connect',
}
export const CONTROLLERS = {
	[WalletName.STATION]: new StationController(),
	[WalletName.KEPLR]: new KeplrController(WC_PROJECT_ID),
	[WalletName.LEAP]: new LeapController(WC_PROJECT_ID),
	[WalletName.COSMOSTATION]: new CosmostationController(WC_PROJECT_ID),
}

export function getRpc(chain) {
	switch (chain) {
	case 'osmosis-1':
		return 'https://rpc.osmosis.zone'
	case 'juno-1':
		return 'https://juno-rpc.polkachu.com'
	case 'kaiyo-1':
		return 'https://rpc.kaiyo.kujira.setten.io'
	case 'phoenix-1':
		return 'https://terra-rpc.publicnode.com'
	case 'columbus-5':
		return 'https://terra-classic-rpc.publicnode.com'
	case 'neutron-1':
		return 'https://neutron-rpc.polkachu.com'
	default:
		throw new Error('Unknown chain')
	}
}

export function getGasPrice(chain) {
	switch (chain) {
	case 'osmosis-1':
		return {
			amount: '0.0025',
			denom: getDenom(chain)
		}
	case 'juno-1':
		return {
			amount: '0.001',
			denom: getDenom(chain)
		}
	case 'kaiyo-1':
		return {
			amount: '0.00119',
			denom: getDenom(chain)
		}
	case 'phoenix-1':
		return {
			amount: '0.015',
			denom: getDenom(chain)
		}
	case 'columbus-5':
		return {
			amount: '28.325',
			denom: getDenom(chain)
		}
	case 'neutron-1':
		return {
			amount: '0.01',
			denom: getDenom(chain)
		}
	default:
		throw new Error('Unknown chain')
	}
}

export function getDenom(chain) {
	switch (chain) {
	case 'osmosis-1':
		return 'uosmo'
	case 'juno-1':
		return 'ujuno'
	case 'kaiyo-1':
		return 'ukuji'
	case 'phoenix-1':
	case 'columbus-5':
		return 'uluna'
	case 'neutron-1':
		return 'untrn'
	default:
		throw new Error('Unknown chain')
	}
}

const chainIds = ['columbus-5']

export const chainInfos = chainIds.map((chainId) => ({
	chainId,
	rpc: getRpc(chainId),
	gasPrice: getGasPrice(chainId),
}))
