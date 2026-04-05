/* ===============================
   API CONFIG
   =============================== */

// GANTI URL INI SAAT DEPLOY
const API_BASE_URL = "http://localhost:3000/api";

/* ===============================
   STORY API
   =============================== */

/**
 * Ambil semua cerita global
 */
export async function getStories() {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`);
    if (!response.ok) throw new Error("Gagal mengambil cerita");
    return await response.json();
  } catch (error) {
    console.error("ERROR getStories:", error);
    return [];
  }
}

/**
 * Ambil satu cerita berdasarkan ID
 */
export async function getStoryById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`);
    if (!response.ok) throw new Error("Cerita tidak ditemukan");
    return await response.json();
  } catch (error) {
    console.error("ERROR getStoryById:", error);
    return null;
  }
}

/**
 * Tambah cerita baru (GLOBAL)
 */
export async function addStory(storyData) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(storyData)
    });

    if (!response.ok) throw new Error("Gagal menambahkan cerita");
    return await response.json();
  } catch (error) {
    console.error("ERROR addStory:", error);
    return null;
  }
}

/**
 * Hapus cerita (opsional, butuh auth nanti)
 */
export async function deleteStory(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Gagal menghapus cerita");
    return true;
  } catch (error) {
    console.error("ERROR deleteStory:", error);
    return false;
  }
}
