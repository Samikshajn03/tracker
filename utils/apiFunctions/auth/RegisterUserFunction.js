

export async function registerUser({ username, email, password }) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    return data; 
  } catch (error) {
    throw new Error(error.message);
  }
}
