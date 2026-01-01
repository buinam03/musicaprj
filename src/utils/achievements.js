const STORAGE_KEY = 'musica_selected_achievements';

export const saveSelectedAchievements = (achievements) => {
  try {
    // Filter out null values và chỉ lưu những achievements hợp lệ
    const validAchievements = achievements.filter(item => item !== null);
    const dataToSave = validAchievements.map(item => ({
      id: item.id,
      img: item.img,
      title: item.title
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return dataToSave;
  } catch (error) {
    console.error('Error saving achievements:', error);
    return [];
  }
};

export const getSelectedAchievements = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading achievements:', error);
    return [];
  }
};

export const clearSelectedAchievements = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing achievements:', error);
    return [];
  }
};

