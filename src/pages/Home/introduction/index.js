import React from "react";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { aaTrack } from '../../../services/tracking';
import { TRACK_DEFINE } from "../../../services/tracking/define";

const Introduction = () => {
    return (
        <div className={styles.container}>
        	<div className={styles.wrapper}>
				<h3 className={styles.title}>
					Spontaneous, permissionless calling
				</h3>

				<p className={styles.description}>
					Sometimes a quick chat is all you need to get things done. Jam is simple click-to-talk, audio-first software without the endless fuss of Zoom links and Meet invites. 
				</p>

				<div className={styles.actions}>
					<Link to="/login" onClick={() => aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_TRY_FOR_FREE)}>
						Try for free
					</Link>

					<div>
						No download required.
					</div>
				</div>
			</div>
		</div>
    )
}

export default Introduction