<script>
	import { activeChapter } from '$lib/store'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	onMount(() => {
		const timeline = gsap.timeline({ paused: true })

		timeline.add(() => {
			activeChapter.set(4)
		}, 2)

		timeline.play()

		return () => {
			if (timeline) {
				timeline.kill()
				timeline.clear()
			}
		}
	})
</script>
