import { writable } from 'svelte/store'

const canHover = writable(false)

const clickStamp = writable(undefined)

const gl = writable({
	orthographicCamera: null,
	perspectiveCamera: null,
	renderer: null
})

const webpSupported = writable(false)

const windowSize = writable({
	w: 0,
	h: 0
})

export { canHover, clickStamp, gl, webpSupported, windowSize }
