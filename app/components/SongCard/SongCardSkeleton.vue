<script setup lang="ts">
defineProps<{
	delay?: number;
}>();
</script>

<template>
	<div
		class="relative aspect-3/2 rounded-3xl overflow-hidden min-w-[400px] snap-start scroll-mx-8 first-of-type:ms-4 last-of-type:me-4 bg-white/5 backdrop-blur-xl animate-pulse"
		:style="{
			animationDelay: delay ? `${delay}ms` : '0ms',
		}"
	>
		<div class="absolute inset-0 p-6 flex flex-col justify-end">
			<!-- Title Placeholder -->
			<div class="h-8 w-3/4 bg-white/10 rounded-md mb-2" />
			<!-- Artist Placeholder -->
			<div class="h-5 w-1/2 bg-white/10 rounded-md" />
		</div>
	</div>
</template>
