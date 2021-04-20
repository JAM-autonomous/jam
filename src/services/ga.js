import configs from "../config/config.js"

export const initGaTracking = () => {
	if(
		typeof window != "undefined"
		&&
		configs.GA_CONFIG
		&&
		configs.GA_CONFIG.trackingId
	){
		const initGAScript = document.createElement("script")
		initGAScript.async = true
		initGAScript.src = `https://www.googletagmanager.com/gtag/js?id=${configs.GA_CONFIG.trackingId}`

		const startGAScript = document.createElement("script")
		startGAScript.innerHTML = `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', '${configs.GA_CONFIG.trackingId}');
		`

		const head = document.getElementsByTagName("head")[0]
		head.appendChild(initGAScript)
		initGAScript.onload = () => {
			head.appendChild(startGAScript)
		}
	}
}