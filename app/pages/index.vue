<script setup lang="ts">
import SongCardCarousel from '~/components/SongCard/SongCardCarousel.vue';

useHead({
  title: 'Página Inicial',
});

const { fetchSongs, isLoading } = useLibrary();

const recentlySongs = useState<SongSummary[]>(`library-recent-added`, () => []);
const duetSongs = useState<SongSummary[]>(`library-duet-songs`, () => []);

onMounted(async () => {
  setTimeout(async () => {
    if (!recentlySongs.value.length) await fetchSongs({ page: 1, limit: 20, sort: 'date', order: 'desc' }).then((fetchedSongs) => {
      recentlySongs.value = fetchedSongs;
    });

    if (!duetSongs.value.length) await fetchSongs({ page: 1, limit: 20, type: 'duet' }).then((fetchedSongs) => {
      duetSongs.value = fetchedSongs;
    });
  }, 2000);
});
</script>

<template>
  <div class="flex flex-col gap-8 *:mb-8">
    <div class="px-8 py-6">
      <ExperimentHoudiniHeader />
    </div>

    <SongCardCarousel
      title="Adicionados Recentemente"
      :songs="recentlySongs"
      :loading="isLoading || recentlySongs.length === 0"
    />
    
    <SongCardCarousel
      title="Duetos para cantar junto"
      :songs="duetSongs"
      :loading="isLoading || duetSongs.length === 0"
    />
  </div>
</template>
