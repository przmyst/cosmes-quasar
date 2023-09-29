function parseUnits(value, decimals = 6) {
	if (typeof value !== 'string') {
		throw new Error('The value should be a string.')
	}

	let [intPart, fractionPart] = value.split('.')

	fractionPart = fractionPart || ''

	if (fractionPart.length > decimals) {
		throw new Error(`Too many decimal places. Max allowed is ${decimals}.`)
	}

	while (intPart.charAt(0) === '0') {
		intPart = intPart.slice(1)
	}

	while (fractionPart.length < decimals) {
		fractionPart += '0'
	}

	return `${intPart}${fractionPart}`
}

export {
	parseUnits
}
