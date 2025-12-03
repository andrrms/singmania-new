<script setup lang="ts">
const props = defineProps<{
	song: SongSummary;
}>();

const coverUrl = computed(() => {
	const c = props.song.cover;
	if (c) {
		try {
			return new URL(c).href;
		} catch {
			// not a valid URL -> fall through
		}
	}
	if (props.song.youtube_id) {
		return `https://img.youtube.com/vi/${props.song.youtube_id}/mqdefault.jpg`;
	}
	return `https://placehold.co/600x400/png?text=No+Cover`;
});
</script>

<template>
	<div class="group relative aspect-3/2 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 min-w-[400px] snap-start scroll-mx-12 first-of-type:ms-4 last-of-type:me-4">

		<!-- Background Image -->
		<div
			class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
			:style="{ backgroundImage: `url(${coverUrl})` }" />

		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

		<!-- Song Info -->
		<div class="absolute inset-0 p-6 flex flex-col justify-end">
			<div class="flex gap-2 mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
				<span
					v-if="song.youtube_id"
					class="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
					YouTube
				</span>
				<span v-else class="px-2 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
					Local
				</span>
			</div>

			<h3
				class="text-2xl font-black text-white leading-tight drop-shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
				{{ song.title }}
			</h3>
			<p
				class="text-white/80 font-medium text-sm drop-shadow-md transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
				{{ song.artist }}
			</p>
		</div>

		<!-- Hover Shine Effect -->
		<div
			class="absolute inset-0 bg-linear-to-r from-transparent via-white/10 via-30% to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
			style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, transparent 30%, transparent 35%, rgba(255,255,255,0.1) 45%, transparent)" />
	</div>
</template>
