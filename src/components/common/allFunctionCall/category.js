 

// Client-side helper
export async function fetchCategories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/getCategory`);
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
 