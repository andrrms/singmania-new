<script lang="ts" setup>
import NavigationSidebar from '~/components/NavigationSidebar/NavigationSidebar.vue';


</script>

<template>
  <div class="h-screen w-screen bg-black text-white font-sans overflow-hidden relative">
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-linear-to-br from-indigo-900/40 via-purple-900/20 to-black" />
      <ParticlesBackground />
    </div>

    <div class="z-10 relative grid grid-cols-[auto_1fr] h-full">
      <NavigationSidebar />

      <main class="h-full overflow-auto grid grid-rows-[auto_1fr]">
        <div class="sticky top-0 z-40 px-8 py-6 flex justify-between items-center bg-linear-to-b from-black/80 to-transparent backdrop-blur-sm shrink-0">
          <div class="flex items-end gap-2 select-none">
            <h1 class="text-3xl font-black tracking-tighter leading-tight">
              Sing<span class="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">Mania</span>
            </h1>
            <span class="leading-[1.8] text-sm text-white/40">v0.1</span>
          </div>
        </div>

        <div class="h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>