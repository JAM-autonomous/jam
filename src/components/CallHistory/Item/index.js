import React from "react"
import styles from "./styles.module.scss"
import { formatDateTimeFromTimestamp } from "../../../helper/datetime"
import { callHistoryType } from "../../../services/callHistory"
import { getNameFromEmail, capitalizeFirstLetter, cx } from "../../../helper/utils"

const HistoryItem = ({ type, users, startTime, endTime, joinedUsers, isRead }) => {
    const getHistoryMessage = () => {
        switch (type) {
            case callHistoryType.joiningExistedRoom:
                return (
                    <span>
                		You <span className={styles.joining}>joined</span> room with
                	</span>
                )
            case callHistoryType.incomingCall:
                return (
                    <span>
                		You received a call from
                	</span>
                )
            case callHistoryType.missingCall:
                return (
                    <span>
                		You <span className={styles.missing}>missed</span> a call from
                	</span>
                )
            default:
                return (
                    <span>You called with</span>
                )
        }
    }

    const getUsersName = () => {
    	let _users = users.concat(joinedUsers || [])

    	if(_users.length == 1){
    		return (
    			<b>
					{capitalizeFirstLetter(getNameFromEmail(_users[0].email))}
				</b>
    		) 
    	}

    	if(_users.length == 2){
    		return (
    			<>
    				<b>
    					{capitalizeFirstLetter(getNameFromEmail(_users[0].email))}
    				</b>
    				{" and "}
    				<b>
    					{capitalizeFirstLetter(getNameFromEmail(_users[1].email))}
    				</b>
    			</>
    		)
    	}

    	return (
			<>
				<b>
					{capitalizeFirstLetter(getNameFromEmail(_users[0].email))}
				</b>
				{", "}
				<b>
					{capitalizeFirstLetter(getNameFromEmail(_users[1].email))}
				</b>
				{" and "}
				<b>
					{_users.length - 2} other(s)
				</b>
			</>
		)
    }

    return (
        <div className={cx(styles.container, isRead && styles.isRead)}>
			<div className={styles.message}>
				{getHistoryMessage()}
				{" "}
				{
					!!users.length
					&&
					getUsersName()
				}
				.
			</div>

            <div className={styles.time}>
                {formatDateTimeFromTimestamp(startTime)}
            </div>
		</div>
    )
}

export default HistoryItem