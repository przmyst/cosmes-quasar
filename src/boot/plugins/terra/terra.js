import useTopics from 'boot/plugins/topics/topics'
import {
	initProvider
} from 'boot/util/DI'
import {
	head, pipe
} from 'ramda'
import {
	reactive
} from 'vue'
import {
	from, map, pluck, switchMap, withLatestFrom
} from 'rxjs'
import {
	tap
} from 'rxjs/operators'

const [TerraSymbol, useTerra] = initProvider('TerraSymbol')

const createTerra = config => {

	const TerraState = reactive({
		loading: false,
		balances: {
		}
	})

	const {
		Message,
		Topic
	} = useTopics

	let isInjected = false

	const InjectTerra = (LCDClient) => {
		if (isInjected) return

		isInjected = true

		Message('terra', 'lcd', new LCDClient({
			URL: 'https://terra-classic-lcd.publicnode.com',
			chainID: 'columbus-5',
			gasAdjustment: 10,
			gasPrices: {
				uluna: '30'
			},
			isClassic: true
		}))
	}

	Topic('wallet', 'account')
		.pipe(pluck('address'))
		.pipe(withLatestFrom(Topic('terra', 'lcd')))
		.pipe(switchMap(([address, lcd]) =>
			from(lcd.bank.balance(address))
		))
		.pipe(map(head))
		.pipe(pluck('_coins'))
		.pipe(tap(balances => TerraState.balances = balances))
		.subscribe(console.log)

	return {
		InjectTerra,
		TerraState
	}
}

const provideTerra = pipe(createTerra, TerraSymbol)

export {
	provideTerra, useTerra
}
