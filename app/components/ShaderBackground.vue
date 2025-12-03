<script setup lang="ts">
import { 
  Shader,
	Glow,
	Saturation,
	SolidColor,
	Circle,
	ProgressiveBlur,
	DotGrid,
	Godrays
} from 'shaders/vue';
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none bg-black">
    <Shader class="w-full h-full opacity-60">
      <Glow
				:intensity="2.69"
				:threshold="0.37"
				:size="27.5"
			>
				<Saturation :intensity="1.13">
					<SolidColor color="#240122" />
				</Saturation>
				<Circle
					color="#6E407A"
					:transform="{ offsetX: 0, offsetY: -0.5 }"
					:radius="1.03"
					:softness="0.57"
				/>
				<ProgressiveBlur
					:intensity="5"
					:angle="270"
					:falloff="1"
					blend-mode="linear-dodge"
				>
					<DotGrid
						color="#592A55"
						:density="160"
						:dot-size="0.22"
						:twinkle="1"
					/>
				</ProgressiveBlur>
				<Godrays
					ray-color="#4E1A52"
					blend-mode="linear-dodge"
					:center="{ x: 0.5, y: 0 }"
					:density="0.1"
					:intensity="1"
					:spotty="0.14"
					:speed="1.82"
				/>
			</Glow>
    </Shader>
    
    <!-- Vignette Overlay for depth -->
    <!--<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />-->
  </div>
</template>