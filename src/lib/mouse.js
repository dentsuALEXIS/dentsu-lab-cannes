import { browser } from '$app/environment'
import { clickStamp, windowSize } from './store'
import { get, writable } from 'svelte/store'

import Device from 'svelte-device-info'

const mouse = writable(
	{
		active: true,
		mouse: {
			x: 0,
			y: 0,
			w: 0
		},
		pointer: {
			x: 0,
			y: 0,
			moved: false
		},
		on: {
			x: 0,
			y: 0
		},
		drag: {
			x: 0,
			y: 0,
			active: false
		}
	},
	(_, update) => {
		let isDragging = false
		let timeout = null

		function getPosition(e) {
			const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
			const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY

			return {
				x: x,
				y: y
			}
		}

		function onMouseMove(e) {
			// if (e.target.closest('nav') || e.target.tagName === 'NAV') {
			// 	update((store) => {
			// 		if (store) {
			// 			store.active = false

			// 			return store
			// 		}
			// 	})

			// 	return
			// }

			const { x, y } = getPosition(e)

			const scaledX = x / 1
			const scaledY = y / 1

			const windowS = get(windowSize)

			update((store) => {
				if (store) {
					store.mouse.x = (x / windowS.w - 0.5) * 2
					store.mouse.y = -(y / windowS.h - 0.5) * 2

					store.pointer.moved = true
					store.pointer.x = x
					store.pointer.y = y

					store.active = true

					return store
				}
			})

			if (!isDragging) {
				return
			}

			update((store) => {
				if (store) {
					store.drag.x = store.on.x + scaledX
					store.drag.y = store.on.y + scaledY

					return store
				}
			})
		}

		function onMouseDown(e) {
			clickStamp.set(e.timeStamp)

			if (e.touches && e.touches.length > 1) {
				isDragging = false

				return
			}

			const { x, y } = getPosition(e)

			const scaledX = x / 1
			const scaledY = y / 1

			update((store) => {
				if (store) {
					store.on.x = store.drag.x - scaledX
					store.on.y = store.drag.y - scaledY

					return store
				}
			})

			isDragging = true

			timeout = setTimeout(() => {
				update((store) => {
					if (store) {
						store.drag.active = true

						return store
					}
				})
			}, 150)
		}

		function onMouseUp(e) {
			if (!isDragging) {
				return
			}

			if (e.touches && e.touches.length >= 1) {
				return
			}

			if (timeout) {
				clearTimeout(timeout)
			}

			update((store) => {
				if (store) {
					// store.mouse.x = 1000
					// store.mouse.y = -1000
					store.drag.active = false

					isDragging = false

					return store
				}
			})
		}

		if (browser) {
			const isDevice = Device.PointingAccuracy !== 'fine'

			const events = {
				move: isDevice ? 'touchmove' : 'mousemove',
				down: isDevice ? 'touchstart' : 'mousedown',
				up: isDevice ? 'touchend' : 'mouseup'
			}

			const { move, down, up } = events

			const windowS = get(windowSize)

			if (windowS) {
				update((store) => {
					if (store) {
						store.pointer.x = windowS.w / 2
						store.pointer.y = windowS.h / 2

						return store
					}
				})
			}

			window.addEventListener('click', onMouseMove)

			window.addEventListener(move, onMouseMove)
			window.addEventListener(down, onMouseDown)
			window.addEventListener(up, onMouseUp)
		}

		return () => {
			if (browser) {
				const isDevice = Device.PointingAccuracy !== 'fine'

				const events = {
					move: isDevice ? 'touchmove' : 'mousemove',
					down: isDevice ? 'touchstart' : 'mousedown',
					up: isDevice ? 'touchend' : 'mouseup'
				}

				const { move, down, up } = events

				window.removeEventListener('click', onMouseMove)

				window.removeEventListener(move, onMouseMove)
				window.removeEventListener(down, onMouseDown)
				window.removeEventListener(up, onMouseUp)
			}
		}
	}
)

export { mouse }
