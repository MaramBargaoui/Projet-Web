export const createShow = async (token, showData) => {
    const response = await fetch('/api/shows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(showData),
    });
    const data = await response.json();
    return data;
  };
  