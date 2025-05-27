export async function fetchDestination({ userId}) {
  try {
    const response = await fetch('/api/FetchDashboardCardDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch destination');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
