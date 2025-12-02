// api.js
const BASE_URL = 'https://671891927fc4c5ff8f49fcac.mockapi.io/v2/';

export const userApi = {
  getAll: async (page = 1, limit = 10, sortBy = 'createdAt', order = 'asc') => {
    const url = new URL(BASE_URL);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    url.searchParams.append('sortBy', sortBy);
    url.searchParams.append('order', order);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    const total = Number(response.headers.get("X-Total-Count") || 0);

    return { data, total };
  },
  getTotal: async () => {
    const url = new URL(BASE_URL);
    url.searchParams.append('limit', 99999);

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch total');
    const data = await response.json();

    return data.length;  // ⬅ số lượng user thật
  },
  add: async (data) => {
    const { id, ...cleanData } = data;
    if (cleanData.avatar && cleanData.avatar.length > 3000) {
      cleanData.avatar = `https://ui-avatars.com/api/?name=${cleanData.name}&background=random`;
    }

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Lỗi API Add:", errorText);
      throw new Error('Failed to add user: ' + response.status);
    }
    return await response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return await response.json();
  }
};