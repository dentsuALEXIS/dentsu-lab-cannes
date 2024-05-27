<script>
	import { onMount } from "svelte";
	import { getStoryblokApi } from "@storyblok/svelte";

	let story = null;
	onMount(async () => {
		const storyblokApi = getStoryblokApi();

		const { data } = await storyblokApi.get("cdn/stories/home", {
			version: "draft",
		});

		story = data.story;
	});
</script>

<section
	class="fixed inset-0 flex h-full items-center justify-center text-white"
>
	<span>Intro</span>
</section>

<style>
	
</style>