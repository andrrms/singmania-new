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
	return null;
});
</script>

<template>
  <div class="cassette-wrapper group relative w-full min-w-[300px] max-w-[360px] aspect-[1.6] cursor-pointer snap-start scroll-mx-12 first-of-type:ms-4 last-of-type:me-4">
    <div class="w-full h-full bg-gray-900 rounded-xl shadow-xl flex flex-col items-center p-2 border-b-4 border-r-4 border-gray-950 transition-all duration-100 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110 group-hover:-rotate-2 group-hover:shadow-2xl group-hover:z-10 group-focus-visible:ring-4 group-focus-visible:ring-white">
      
      <!-- Screws -->
      <div class="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div class="w-1 h-px bg-gray-900 rotate-45" /></div>
      <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div class="w-1 h-px bg-gray-900 rotate-45" /></div>
      <div class="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div class="w-1 h-px bg-gray-900 rotate-45" /></div>
      <div class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center shadow-inner"><div class="w-1 h-px bg-gray-900 rotate-45" /></div>

      <!-- Label Area -->
      <div class="w-[94%] h-[80%] bg-[#f0f0f0] rounded-md mt-1 relative overflow-hidden flex flex-col items-center shadow-sm border border-gray-300">
        <!-- Background Art (faded) -->
        <div class="absolute inset-0 bg-cover bg-center opacity-35 grayscale contrast-125" :style="coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}" />
        
        <!-- Title/Artist -->
        <div class="relative z-10 w-full px-4 pt-2 text-center">
          <h3 class="font-black text-gray-900 text-lg leading-none truncate uppercase tracking-tighter">{{ song.title }}</h3>
          <p class="font-bold text-gray-500 text-[10px] truncate uppercase tracking-widest mt-0.5">{{ song.artist }}</p>
        </div>

        <!-- Tape Window -->
        <div class="relative z-10 mt-auto mb-3 w-[65%] h-10 bg-gray-800 rounded-full flex items-center justify-between px-2 shadow-inner border-2 border-gray-400">
           <!-- Left Spool -->
           <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 border-[3px] border-dashed border-gray-400 rounded-full animate-spin-slow group-hover:animate-spin-fast" />
              <div class="w-2 h-2 bg-gray-800 rounded-full z-10" />
           </div>
           
           <!-- Tape Center -->
           <div class="flex-1 h-full mx-1 flex items-center justify-center">
             <div class="w-full h-4 bg-black/20 rounded-sm backdrop-blur-sm" />
           </div>

           <!-- Right Spool -->
           <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
              <div class="absolute inset-0 border-[3px] border-dashed border-gray-400 rounded-full animate-spin-slow group-hover:animate-spin-fast" />
              <div class="w-2 h-2 bg-gray-800 rounded-full z-10" />
           </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.clip-trapezoid {
  clip-path: polygon(5% 0, 95% 0, 100% 100%, 0% 100%);
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
  animation-play-state: paused;
}
.group:hover .animate-spin-slow {
  animation-play-state: running;
}
.animate-spin-fast {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
