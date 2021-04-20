import React from "react"
import styles from "./styles.module.scss"
import { cx } from "../../../helper/utils"

//resources
import previewImage from "../../../resources/images/landing-page/preview-image.png"
import previewImageMobile from "../../../resources/images/landing-page/preview-image-mobile.png"

const Preview = () => {
	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<img src={previewImage} className={cx(styles.mainImage, styles.desk)}/>
				<img src={previewImageMobile} className={styles.mainImage, styles.mobile}/>
			</div>
		</div>
	)
}

export default Preview