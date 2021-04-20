import React from "react"
import styles from "./styles.module.scss"

const FeatureItem = props => {
    const { icon, title, description } = props

    return (
        <div className={styles.container}>
        	<img src={icon} className={styles.icon}/>
        	<h3 className={styles.title} dangerouslySetInnerHTML={{ __html: title }}></h3>
        	<p className={styles.description}>{description}</p>
		</div>
    )
}

export default FeatureItem