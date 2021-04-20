import React from "react"
import styles from "./styles.module.scss"

//child components
import Item from "./item"

//resources
import f1Icon from "../../../resources/images/landing-page/f1-ic.svg"
import f2Icon from "../../../resources/images/landing-page/f2-ic.svg"
import f3Icon from "../../../resources/images/landing-page/f3-ic.svg"

const Features = () => {
    return (
        <div className={styles.container}>
			<div className={styles.wrapper}>
				<Item
					icon={f1Icon}
					title="Jam with anyone or everyone instantly"
					description="Once you’re logged in with your work email, simply click a colleague’s name to talk or hop into an ongoing conversation. Connecting on Jam feels just like popping by someone’s desk."
				/>

				<Item
					icon={f2Icon}
					title="This meeting could be <span>an email</span> on Jam"
					description="Don’t waste time juggling disjointed Slack threads. Don’t kill your workflow with scheduled calls. Just get that quick yes or no, share what you’re working on, and move on."
				/>

				<Item
					icon={f3Icon}
					title="Have more productive conversations"
					description="Jam prioritizes what matters. Audio is crisp and lag-free, so you can actually hear and be heard. And because anyone is just a click away, interactions are completely effortless."
				/>
			</div>
		</div>
    )
}

export default Features