<script setup lang="ts">
const online = useOnline();
</script>

<template>
	<div
		class="border rounded-full px-2 py-1.5 inline-flex items-center gap-2 select-none"
		:class="online ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-red-500 text-red-400 bg-red-500/10'"
	>
		<div
			class="w-2 h-2 rounded-full"
			:class="online ? 'bg-green-400' : 'bg-red-400'"
		/>

		<span class="text-xs uppercase leading-none">
			{{ online ? 'Online' : 'Offline' }}
		</span>
	</div>
</template>