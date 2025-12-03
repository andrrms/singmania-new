<script setup lang="ts">
defineProps<{
	title: string;
	songs: SongSummary[];
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: 'select', song: SongSummary): void;
}>();

const scrollContainer = ref<HTMLElement | null>(null);
const scroll = (direction: 'left' | 'right') => {
	if (!scrollContainer.value) return;
	
	const scrollAmount = direction === 'left' ? -400 : 400;
	scrollContainer.value.scrollBy({
		left: scrollAmount,
		behavior: 'smooth',
	});
};
</script>

<template>
	<div class="flex flex-col gap-4">
		<div class="px-8 flex items-center justify-between">
			<h2 class="text-2xl font-bold font-montserrat">{{ title }}</h2>

			<div v-if="!loading" class="flex items-center gap-2">
				<button
					class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
					@click="scroll('left')"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
					@click="scroll('right')"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l 7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>

		<div ref="scrollContainer" class="flex py-5 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none">
			<template v-if="loading">
				<SongCardSkeleton v-for="n in 10" :key="n" :delay="(n * 100)" />
			</template>
			<template v-else>
				<SongCardCassette
					v-for="song in songs"
					:key="song.id"
					class="z-30"
					:song="song"
					@click="() => emit('select', song)"
				/>
			</template>
		</div>
	</div>
</template>
