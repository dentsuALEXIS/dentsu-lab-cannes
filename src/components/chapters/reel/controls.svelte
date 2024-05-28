<script>
	import { onMount } from 'svelte'

	export let video

	onMount(() => {
		console.log(video)
	})
</script>
