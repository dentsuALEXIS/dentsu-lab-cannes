<script>
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	export let location

	let letters = []

	onMount(() => {
		const timeline = new gsap.timeline({ paused: true })

		letters.forEach((letter, index) => {
			timeline.add(
				gsap.to(letter, {
					marginLeft: `1vw`,
					duration: 0.2,
					delay: index * 0.075,
					ease: 'expo.inOut'
				}),
				0
			)
		})

		timeline.progress(0)

		timeline.play()
	})
</script>

{#each location.split('') as letter, i}
	<span bind:this={letters[i]}>{letter}</span>
{/each}
