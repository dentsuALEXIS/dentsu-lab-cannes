<script>
	import { activeChapter } from '$lib/store'

	import Cases from './cases.svelte'
	import Clients from './clients.svelte'
	import Intro from './intro/index.svelte'
	import Reel from './reel/index.svelte'
	import Statement from './statement.svelte'
</script>

{#if $activeChapter === 0}
	<Intro />
{/if}

{#if $activeChapter === 1}
	<Statement />
{/if}

{#if $activeChapter === 2}
	<Reel />
{/if}

{#if $activeChapter === 3}
	<Cases />
{/if}

{#if $activeChapter === 4}
	<Clients />
{/if}
