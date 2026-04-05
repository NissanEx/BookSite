const API_URL = 'https://script.google.com/macros/s/AKfycby_buTOOVUGQT2vYjD6UbKEtojQi5iZR14vMhNTd1y9z-1DprifpXCGjYj47IbjDmY/exec';

async function apiGet(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${query}`);
  return res.json();
}

async function apiPost(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getApprovedStories() {
  return apiGet({ action: 'getApproved' });
}

async function getUserStories(username) {
  return apiGet({ action: 'getByUser', username });
}

async function getAllStories() {
  return apiGet({ action: 'getAll' });
}

async function submitStory(storyData) {
  return apiPost({ action: 'addStory', ...storyData });
}

async function updateStatus(id, status) {
  return apiPost({ action: 'updateStatus', id, status });
}

async function editStory(id, updates) {
  return apiPost({ action: 'updateStory', id, ...updates });
}