import React from "react"
import styles from "./styles.module.scss"

//Child layouts
import Introduction from "./introduction"
import Preview from "./preview"
import Features from "./features"
import CTA from "./cta"
import Footer from "./footer"
import { aaTrack } from "../../services/tracking"
import { PAGE_NAMES } from "../../services/tracking/define"

aaTrack.trackPage(PAGE_NAMES.LANDING_PAGE);

const Home = () => {
	return (
		<div className={styles.container}>
			<Introduction />
			<div className={styles.fullWidth}>
				<Preview />
			</div>
			<Features />
			<div className={styles.fullWidth}>
				<CTA />
				<Footer />
			</div>
		</div>
	)
}

export default Home