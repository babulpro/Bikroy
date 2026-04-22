 

// Client-side helper
export async function fetchCategories(url) {
  try {
    const response = await fetch(`${url} `);
    const data = await response.json();
    if (data.status === 'success') {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
 