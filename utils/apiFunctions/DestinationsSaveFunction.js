export async function saveDestination({ userId, country, city, imageFiles, memory }) {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('memory', memory);

    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch('/api/DestinationSaving', {
      method: 'POST',
      body: formData, // Don't set Content-Type, browser will do it
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save destination');
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}
