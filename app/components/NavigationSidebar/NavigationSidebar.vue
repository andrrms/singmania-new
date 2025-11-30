<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const activePage = computed(() => {
	if (route.path === '/') return 'home';
	if (route.path.startsWith('/search')) return 'search';
	if (route.path.startsWith('/library')) return 'library';
	if (route.path.startsWith('/settings')) return 'settings';
	return '';
});

const navigate = (page: 'home' | 'search' | 'library' | 'settings') => {
	switch (page) {
		case 'home':
			return router.push('/');
		case 'search':
			return router.push('/search');
		case 'library':
			return router.push('/library');
		case 'settings':
			return router.push('/settings');
	}
};
</script>

<template>
	<div class="w-24 h-full flex flex-col items-center py-8 bg-black/40 backdrop-blur-xl border-r border-white/10 relative z-50">
		<NuxtLink to="/" class="group">
			<AppLogo class="group-hover:scale-110 duration-300" />
		</NuxtLink>

		<div class="flex-1 flex flex-col gap-8 w-full px-4">
			<NavigationSidebarButton :active="activePage === 'home'" @click="navigate('home')">
				<Icon
					name="material-symbols:home-rounded"
					class="w-8 h-8"
					:class="activePage === 'home' ? 'text-black' : 'text-white/50'"
					size="2em" />
			</NavigationSidebarButton>

			<NavigationSidebarButton :active="activePage === 'library'" @click="navigate('library')">
				<Icon
					name="material-symbols:library-music-rounded"
					class="w-8 h-8"
					:class="activePage === 'library' ? 'text-black' : 'text-white/50'"
					size="2em" />
			</NavigationSidebarButton>

			<NavigationSidebarButton :active="activePage === 'search'" @click="navigate('search')">
				<Icon
					name="material-symbols:search-rounded"
					class="w-8 h-8"
					:class="activePage === 'search' ? 'text-black' : 'text-white/50'"
					size="2em" />
			</NavigationSidebarButton>

			<NavigationSidebarButton :active="activePage === 'settings'" class="mt-auto" @click="navigate('settings')">
				<Icon
					name="material-symbols:settings-rounded"
					class="w-8 h-8"
					:class="activePage === 'settings' ? 'text-black' : 'text-white/50'"
					size="2em" />
			</NavigationSidebarButton>
		</div>
	</div>
</template>
