import { writable } from 'svelte/store'

const activeChapter = writable(2)

const timelines = writable(new Array(4).fill(null))

const canHover = writable(false)

const clickStamp = writable(undefined)

const gl = writable({
	orthographicCamera: null,
	perspectiveCamera: null,
	renderer: null
})

const reelElement = writable(undefined)

const webpSupported = writable(false)

const windowSize = writable({
	w: 0,
	h: 0
})

export { activeChapter, canHover, clickStamp, gl, reelElement, webpSupported, windowSize }
