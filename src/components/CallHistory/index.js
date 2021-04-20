import React from "react"
import styles from "./styles.module.scss"
import CallHistoryService from "../../services/callHistory"
import { Scrollbars } from 'react-custom-scrollbars';

//components
import HistoryItem from "./Item"

const CallHistory = () => {
	const [data, setData] = React.useState(CallHistoryService.get().calls)

	React.useEffect(() => {
		CallHistoryService.onAddNewRecord = setData
		CallHistoryService.markAllAsRead()
	}, [])

	return (
		<div className={styles.container}>
			<Scrollbars
				className="activities-scrollbar"
				style={{
					width: 280,
					maxHeight: "480px",
				}}
			>
			{
				!data.length
				?
				<div className={styles.empty}> There's no activity at the moment.</div>
				:
				data.concat([]).reverse().map(record =>
					<HistoryItem {...{
						...record,
						key: `${record.startTime}-${record.endTime}`
					}}/>
				)
			}
			</Scrollbars>
		</div>
	)
}

export default CallHistory