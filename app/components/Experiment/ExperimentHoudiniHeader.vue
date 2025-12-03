<script setup lang="ts">
import duaLipaImage from '~/assets/images/dua-lipa.png';
</script>

<template>
	<header class="relative max-w-[1810px] mx-auto">
		<div class="absolute top-0 left-10 text-black bg-[#29e5f2] px-4 py-2 border-4 border-black font-montserrat font-bold text-[clamp(1.25rem,1.3vw,1.5rem)] rotate-6 -skew-8 select-none z-10">
			Em destaque
		</div>
		<div class="relative bg-[#fe0b84] rounded-xl border-4 border-black p-4 -rotate-2 mt-4 overflow-hidden">
			<div class="absolute bottom-2 left-2 right-2 rounded-md h-[clamp(90px,7.3vw,140px)] bg-black" />
			<div class="absolute top-0 left-0 w-full h-full bg-contain bg-left bg-no-repeat select-none" :style="`background-image: url('${duaLipaImage}')`" />
			<div class="relative w-full z-10 flex flex-col items-end font-montserrat uppercase">
				<h2 class="text-[clamp(9rem,11.5vw,14rem)] leading-[0.75] font-black text-outline-3 select-none">Houdini</h2>
				<h3 class="text-[clamp(7rem,9vw,11rem)] leading-[0.75] text-[#fce00c] font-extrabold text-outline-2 select-none">Dua Lipa</h3>
			</div>
		</div>
		<button class="w-fit text-[clamp(1.5rem,1.5vw,1.875rem)] bg-white text-black font-montserrat font-bold px-8 py-2 float-end -mt-[clamp(3rem,3.3vw,4rem)] me-8 border-4 cursor-pointer rotate-0 hover:rotate-5 hover:bg-[#fce00c] focus-visible:rotate-5 focus-visible:bg-[#fce00c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white ease-out duration-75">
			<span class="select-none">Ir para a música</span>
		</button>
	</header>
</template>