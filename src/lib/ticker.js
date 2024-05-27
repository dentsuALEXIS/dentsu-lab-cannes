import { browser } from '$app/environment'
import { nanoid } from 'nanoid'

class Ticker {
	constructor() {
		this.callbacks = []
		this.now = 0
		this.raf = undefined

		this.setup()
	}

	add(callback, priority = 0) {
		const id = nanoid()

		this.callbacks.push({ id, callback, priority })
		this.callbacks.sort((a, b) => a.priority - b.priority)

		return id
	}

	remove(id) {
		const index = this.callbacks.findIndex((callback) => id === callback.id)

		this.callbacks.splice(index, 1)
	}

	onBlur = () => {
		if (this.raf) {
			window.cancelAnimationFrame(this.raf)
		}
	}

	onTick = (now) => {
		if (browser) {
			this.raf = window.requestAnimationFrame(this.onTick)
		}

		if (now) {
			const deltaTime = now - this.now

			this.now = now

			this.callbacks.forEach(({ callback }) => {
				callback && callback(now, deltaTime)
			})
		}
	}

	setup() {
		if (browser) {
			this.onTick()
		}
	}
}

export const ticker = new Ticker()
