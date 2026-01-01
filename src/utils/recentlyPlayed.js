const STORAGE_KEY = 'musica_recently_played';
const MAX_ITEMS = 10; 

export const getRecentlyPlayed = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading recently played:', error);
    return [];
  }
};

export const addToRecentlyPlayed = (song) => {
  try {
    if (!song || !song.id) {
      console.warn('addToRecentlyPlayed: Invalid song object', song);
      return [];
    }

    const items = getRecentlyPlayed();
    
    // Remove if already exists (to avoid duplicates)
    const filtered = items.filter(item => item.id !== song.id);
    
    // Add to beginning with timestamp
    const newItem = {
      id: song.id,
      title: song.title || 'Unknown Title',
      artwork: song.artwork || 'http://localhost:8080/images/other/Unknown_person.jpg',
      username: song.username || 'Unknown Artist',
      path: song.path,
      duration: song.duration || 0,
      playedAt: new Date().toISOString()
    };
    
    // Add to beginning and limit to MAX_ITEMS
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
    return updated;
  } catch (error) {
    console.error('Error adding to recently played:', error);
    return [];
  }
};

export const clearRecentlyPlayed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing recently played:', error);
    return [];
  }
};


export const removeFromRecentlyPlayed = (songId) => {
  try {
    const items = getRecentlyPlayed();
    const filtered = items.filter(item => item.id !== songId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error removing from recently played:', error);
    return [];
  }
};

export const getTimeAgo = (isoString) => {
  if (!isoString) return 'Unknown';
  
  const now = new Date();
  const playedAt = new Date(isoString);
  const diffMs = now - playedAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

  return playedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: playedAt.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
};

