<script setup lang="ts">
withDefaults(defineProps<{
	active?: boolean;
}>(), {
	active: false,
});
</script>

<template>
	<button
		class="group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300"
		:class="active
			? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110'
			: 'text-white/50 hover:bg-white/10 hover:text-white'">
		<slot />
	</button>
</template>