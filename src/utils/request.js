const request = async (url, req_method, body) => {
  try {
    let method = req_method.toUpperCase();
    if(method === 'GET' || method === "DELETE") {
      const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } else if(method === 'POST' || method === 'PUT') {
      const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      }
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export default request;
