<script setup lang="ts">
import { useSettingsStore } from '~~/app/stores/settings';

useHead({
  title: 'Configurações',
});

const settings = useSettingsStore();
</script>

<template>
	<div class="w-full h-full flex flex-col gap-2 items-center justify-center">
		<h1 class="text-3xl text-white/75">Configurações</h1>
		<p class="text-white/50">Work in Progresss</p>

		<div class="mt-5">
			<p>Reduced motion</p>
			<button
				class="mr-2 bg-white/10 px-4 py-2 rounded-md hover:bg-white/20 duration-200 disabled:opacity-50 disabled:hover:bg-white/10 cursor-pointer"
				:disabled="settings.prefersReducedMotion"
				@click="() => settings.setPreferredMotion('reduced')">
				Enable Reduced Motion
			</button>
			<button
				class="mr-2 bg-white/10 px-4 py-2 rounded-md hover:bg-white/20 duration-200 disabled:opacity-50 disabled:hover:bg-white/10 cursor-pointer"
				:disabled="!settings.prefersReducedMotion"
				@click="() => settings.setPreferredMotion('normal')">
				Disable Reduced Motion
			</button>
		</div>
	</div>
</template>