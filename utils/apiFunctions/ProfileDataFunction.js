export async function fetchUserProfile(user_id) {
  try {
    const response = await fetch('/api/ProfileData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user profile');
    }

    return data; 
  } catch (error) {
    throw new Error(error.message);
  }
}
