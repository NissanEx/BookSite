import { getStories, addStory } from "./api.js";

// Load cerita saat halaman dibuka
window.onload = async () => {
  const stories = await getStories();
  renderStories(stories);
  if (stories.length > 0) selectStory(0, stories);
};

// Contoh simpan cerita baru
async function saveStory(newStory) {
  const saved = await addStory(newStory);
  if (saved) {
    const stories = await getStories();
    renderStories(stories);
  }
}
