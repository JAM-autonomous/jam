const numberToString = number => {
	if(number < 10) return `0${number}`
	return number
}

export const formatDateTimeFromTimestamp = (ts) => {
	const dt = new Date(ts)

	return `${dt.getFullYear()}/${numberToString(dt.getMonth() + 1)}/${numberToString(dt.getDate())}
			${numberToString(dt.getHours())}:${numberToString(dt.getMinutes())}
	`
}