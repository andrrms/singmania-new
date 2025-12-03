<script setup lang="ts">
const props = withDefaults(defineProps<{
  colors?: string[];
}>(), {
  colors: () => ['#FF0099', '#FFEB3B', '#00F0FF', '#9D00FF'], // Vibrant CMYK-ish colors
});

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
let animationFrameId: number;

interface Blob {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  angle: number; // For oscillating movement
}

const blobs: Blob[] = [];

const createBlob = (canvasWidth: number, canvasHeight: number): Blob => {
  const minSize = Math.min(canvasWidth, canvasHeight) * 0.3;
  const maxSize = Math.min(canvasWidth, canvasHeight) * 0.6;
  const radius = Math.random() * (maxSize - minSize) + minSize;

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius,
    color: props.colors[Math.floor(Math.random() * props.colors.length)] || '#FFFFFF',
    vx: (Math.random() - 0.5) * 0.5, // Very slow movement
    vy: (Math.random() - 0.5) * 0.5,
    angle: Math.random() * Math.PI * 2,
  };
};

const initBlobs = (canvasWidth: number, canvasHeight: number) => {
  blobs.length = 0;
  const blobCount = 5; // Keep it low for giant blobs

  for (let i = 0; i < blobCount; i++) {
    blobs.push(createBlob(canvasWidth, canvasHeight));
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (!import.meta.client) return;

  // Clear with a slight fade for trails? No, full clear for blobs usually better
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Use composite operation to blend colors nicely
  ctx.globalCompositeOperation = 'screen'; 

  blobs.forEach((blob) => {
    // Move blobs
    blob.x += blob.vx;
    blob.y += blob.vy;
    
    // Add some sine wave motion
    blob.x += Math.sin(blob.angle) * 0.2;
    blob.y += Math.cos(blob.angle) * 0.2;
    blob.angle += 0.002;

    // Bounce off walls (with margin)
    if (blob.x < -blob.radius) blob.vx = Math.abs(blob.vx);
    if (blob.x > canvas.width + blob.radius) blob.vx = -Math.abs(blob.vx);
    if (blob.y < -blob.radius) blob.vy = Math.abs(blob.vy);
    if (blob.y > canvas.height + blob.radius) blob.vy = -Math.abs(blob.vy);

    // Draw blob
    const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
  });

  animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  if (!import.meta.client) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initBlobs(canvas.width, canvas.height);
};

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

watch(canvasRef, (canvas) => {
  if (!canvas) return;

  handleResize();
  initBlobs(canvas.width, canvas.height);
  animate();

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
    <!-- Blobs Canvas -->
    <canvas v-if="isMounted" ref="canvasRef" class="absolute inset-0 w-full h-full opacity-70 blur-[60px] sm:blur-[100px]" />
    
    <!-- Halftone/Texture Overlay -->
    <div class="absolute inset-0 halftone-overlay opacity-20 mix-blend-overlay" />
    
    <!-- Vignette -->
    <div class="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />
  </div>
</template>

<style scoped>
.halftone-overlay {
  background-image: radial-gradient(circle, #ffffff 2px, transparent 2.5px);
  background-size: 12px 12px;
}

.bg-radial-gradient-vignette {
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
}
</style>
