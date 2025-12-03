export const useLibrary = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Busca músicas com paginação e filtros.
   * Se online: busca da API e salva em cache.
   * Se offline: busca do cache.
   */
  async function fetchSongs(options: SongFilterOptions): Promise<SongSummary[]> {
    isLoading.value = true
    error.value = null
    
    try {
      if (navigator.onLine) { // ? Online: Busca da API
        const params = new URLSearchParams()
        params.append('page', options.page.toString())
        params.append('limit', options.limit.toString())
        if (options.search) params.append('search', options.search)
        if (options.sort) params.append('sort', options.sort)
        if (options.order) params.append('order', options.order)
        if (options.type) params.append('type', options.type)
        if (options.language) params.append('language', options.language)

        const response = await $fetch<APISongsListResponse>(`/api/songs?${params.toString()}`)
        console.log('Músicas carregadas da API:', response)
        
        return response.data.map(({ content, ...rest }) => rest)

        // TODO: Poderíamos salvar essas músicas no cache aqui, 
        // mas como podem vir muitas, talvez seja melhor salvar apenas quando o
        // usuário abrir a música. Ou salvar em background. Por enquanto,
        // seguimos a regra de "abrir = salvar".
      } else { // ? Offline: Busca do cache
        if (import.meta.dev) console.log('Offline: Buscando músicas do cache local...')
        const result = await searchCachedSongs(options)
        return result.data
      }
    } catch (e: any) {
      error.value = e.message || 'Erro ao buscar lista de músicas'
      // Fallback: Se falhar na API (ex: timeout), tenta cache local?
      // Pode ser uma boa estratégia de resiliência.
      if (navigator.onLine) {
         try {
            if (import.meta.dev) console.log('Falha na API, tentando cache local...')
            const result = await searchCachedSongs(options)
            error.value = null // Limpa erro se cache funcionar
            return result.data
         } catch (cacheError) {
            // Mantém o erro original
            console.error('Erro ao buscar músicas:', e)
            return []
         }
      } else {
        console.error('Erro ao buscar músicas:', e)
        return []
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega uma música.
   * Prioridade:
   * 1. IndexedDB (Cache persistente)
   * 2. API (se online) -> Salva no IndexedDB
   */
  async function loadSong(id: string): Promise<SongRow | null> {
    isLoading.value = true
    error.value = null

    try {
      // 1. Tenta buscar do IndexedDB primeiro
      const cached = await getCachedLibraryItem(id)
      
      if (cached) {
        if (import.meta.dev) console.log(`Música ${id} carregada do cache local (IDB)`)
        return cached.song
      }

      // 2. Se não está no cache, verifica conexão
      if (!navigator.onLine) {
        throw new Error('Você está offline e esta música não está salva localmente.')
      }

      // 3. Busca da API
      if (import.meta.dev) console.log(`Buscando música ${id} da API...`)
      const song = await $fetch<SongRow>(`/api/songs/${id}`)
      
      if (!song) {
        throw new Error('Música não encontrada na API.')
      }

      // 4. Salva no cache para uso futuro
      await saveLibraryItem(song)
      if (import.meta.dev) console.log(`Música ${id} salva no cache local (IDB)`)
      
      return song

    } catch (e: any) {
      console.error('Erro ao carregar música:', e)
      error.value = e.message || 'Erro desconhecido ao carregar música'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    loadSong,
    fetchSongs
  }
}
