import React from "react";
import styles from "./styles.module.scss"
import { Link } from "react-router-dom";
import { aaTrack } from "../../../services/tracking";
import { TRACK_DEFINE } from "../../../services/tracking/define";

const CTA = () => {
	return (
		<div className={styles.container}>
			<h3 className={styles.title}>Did we already say no download required?</h3>

			<div className={styles.action}>
				<Link to="/login" onClick={() => aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_START_JAMMING)}>
					Start jamming
				</Link>
			</div>
		</div>
	)
}

export default CTA