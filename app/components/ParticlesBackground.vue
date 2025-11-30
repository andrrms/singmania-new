<script setup lang="ts">
const props = withDefaults(defineProps<{
  colors?: string[];
}>(), {
  colors: () => ['#8B5CF6', '#3B82F6', '#EC4899'],
});

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
let animationFrameId: number;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

const particles: Particle[] = [];

const createParticle = (canvasWidth: number, canvasHeight: number): Particle => {
  const size = Math.random() * 3 + 1;

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    color: props.colors[Math.floor(Math.random() * props.colors.length)] || '#FFFFFF',
    opacity: Math.random(),
  };
};

const initParticles = (canvasWidth: number, canvasHeight: number) => {
  particles.length = 0;
  const particleCount = Math.min(Math.floor((canvasWidth * canvasHeight) / 15000), 100);

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(canvasWidth, canvasHeight));
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (!import.meta.client) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    ctx.fill();
    ctx.closePath();
  });

  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 0.5;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i]!.x - particles[j]!.x;
      const dy = particles[i]!.y - particles[j]!.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i]!.x, particles[i]!.y);
        ctx.lineTo(particles[j]!.x, particles[j]!.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  if (!import.meta.client) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles(canvas.width, canvas.height);
};

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

watch(canvasRef, (canvas) => {
  if (!canvas) return;

  handleResize();
  initParticles(canvas.width, canvas.height);
  animate();

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <canvas v-if="isMounted" ref="canvasRef" class="fixed inset-0 z-0 pointer-events-none" />
</template>
