<!-- <script>
	import { activeChapter } from '$lib/store'

	function seekNext(mode = 'forward') {
		if (mode === 'forward') {
			if ($activeChapter === 4) {
				activeChapter.set(0)
			} else {
				activeChapter.set($activeChapter + 1)
			}
		} else if (mode === 'backwards') {
			if ($activeChapter === 0) {
				activeChapter.set(4)
			} else {
				activeChapter.set($activeChapter - 1)
			}
		}
	}
</script>

<span class="absolute left-0 top-0 bg-white p-1 text-[10px]">
	Active chapter: {$activeChapter}
</span>

<button
	aria-label="Go to previous chapter"
	type="button"
	class="fixed left-0 top-0 h-full w-1/2"
	on:click={() => {
		seekNext('backwards')
	}}
></button>

<button
	aria-label="Go to previous chapter"
	type="button"
	class="fixed right-0 top-0 h-full w-1/2"
	on:click={() => {
		seekNext()
	}}
></button> -->
