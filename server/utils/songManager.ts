import { createClient } from '@supabase/supabase-js';

export const getSongs = async (options: SongFilterOptions): Promise<{ data: SongRow[]; total: number }> => {
  const { page, limit, search, sort, order, type, language } = options;
  const offset = (page - 1) * limit;
  // const fetchAll = limit === -1;
  const fetchAll = false; // Temporariamente desabilitado para evitar sobrecarga no Supabase

  try {
    const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    let query = supabase
      .from('songs')
      .select('*', { count: 'exact' });

    // Busca
    if (search) query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);

    // Filtros
    if (type === 'youtube') {
      query = query.not('youtube_id', 'is', null);
    } else if (type === 'local') {
      query = query.is('youtube_id', null);
    } else if (type === 'duet') {
      query = query.eq('is_duet', true);
    }

    if (language && language !== 'all') {
      query = query.ilike('language', language);
    }

    // Ordenação
    if (sort === 'date') {
      query = query.order('created_at', { ascending: order === 'asc' });
    } else if (sort === 'artist') {
      query = query.order('artist', { ascending: order === 'asc' });
    } else {
      query = query.order('title', { ascending: order === 'asc' });
    }

    // Paginação
    if (!fetchAll) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, count, error } = await query;

    if (error || !data) {
      console.error('Erro ao buscar músicas do Supabase:', error.message);
      return { data: [], total: 0 };
    }

    return { data, total: Number(count) };
  } catch (error) {
    console.error('Erro no Supabase:', error);
    return { data: [], total: 0 };
  }
};

export const getSongContent = async (id: string): Promise<SongRow | null> => {
  try {
    const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Erro ao buscar músicas do Supabase:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro no Supabase:', error);
    return null;
  }
};
