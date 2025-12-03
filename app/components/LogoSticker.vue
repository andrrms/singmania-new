<script setup lang="ts">
// LogoSticker component
// Renders a sticker-like container that adapts to its content (slot)
</script>

<template>
  <div class="sticker-root">
    <div class="sticker-body">
      <div class="sticker-content">
        <slot />
      </div>
    </div>
    <div class="sticker-peel" />
  </div>
</template>

<style scoped>
.sticker-root {
  display: inline-flex;
  position: relative;
  filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));
  --peel-size: 18px;
  --bg-color: #FEE715; /* Vibrant Yellow */
  --border-color: #FFFFFF;
  --border-width: 4px;
}

.sticker-body {
  background-color: var(--border-color);
  padding: var(--border-width);
  border-radius: 6px;
  /* Clip the bottom right corner for the peel effect */
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--peel-size)),
    calc(100% - var(--peel-size)) 100%,
    0 100%
  );
}

.sticker-content {
  background-color: var(--bg-color);
  color: black;
  padding: 0.25rem 0.75rem;
  border-radius: 2px;
  font-weight: 900;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Ensure content doesn't go under the peel if it's tight */
  padding-right: calc(0.75rem + var(--peel-size) * 0.2); 
}

.sticker-peel {
  position: absolute;
  bottom: 0;
  right: 0;
  width: var(--peel-size);
  height: var(--peel-size);
  /* Create the folded triangle effect */
  background: linear-gradient(135deg, #f0f0f0 45%, #d0d0d0 50%, transparent 50%);
  /* Add a subtle shadow to the peel itself to lift it */
  filter: drop-shadow(-1px -1px 1px rgba(0,0,0,0.15));
  pointer-events: none;
  border-top-left-radius: 6px;
}
</style>
