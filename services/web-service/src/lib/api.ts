export const api = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
  fetchProducts: async () => {
    const res = await fetch('/api/products');
    return res.json();
  },
};
