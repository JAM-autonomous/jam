import React from "react"
import styles from "./styles.module.scss"
import { cx } from "../../helper/utils"

const Notification = props => {
    const { type, message, shown, hiding } = props

    return (
        <div className={cx(styles.container, hiding && styles.hiding, shown && styles.shown)}>
			<div className={cx(styles.wrapper, styles[type])}>
				{message}
			</div>
		</div>
    )
}

export default Notification