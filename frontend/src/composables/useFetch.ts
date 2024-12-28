export async function useFetch(endpoint: string, token = '', options = {}) {
    const baseURL = import.meta.env.VITE_BASE_URL;
    let headers: any = {
      'Content-Type': 'application/json',
    }
  
    if (token) {
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`,
      }
    }
    const response = await fetch(`${baseURL}${endpoint}`, {
      credentials: 'include',
      headers,
      ...options
    });
    // Check if the response is successful
    const status = response.status
    if (!response.ok) {
      const errorData = await response.json();
      
      throw new Error(errorData.message || errorData.non_field_errors[0] || 'An error occurred');
    }
  
    // Return the JSON data
    const data = await response.json()
    return { status, data };
  }
  