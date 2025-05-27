export async function loginUser({ email, password }) {
  try {
    const response = await fetch('/api/auth/Login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    sessionStorage.setItem('user', JSON.stringify(data.user));
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('id', data.user.id);


    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
