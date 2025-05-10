const request = async (url, req_method, body) => {
  try {
    let method = req_method.toUpperCase();
    if(method === 'GET' || method === "DELETE") {

      const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json', 
        Authorization: `Bearer ${getCookie()}`},
        credentials: 'include',
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if(response.status === 401 && data.error) {
        const parts = window.location.href.split("/");
        const path = "/" + parts[parts.length-1];
        const pathNames = ["/", "/login", "/careers", "/register", 
          "/onboarding", "/forgot-password", "/education", "/userrs", 
          "/privacy-policy","/404", "/terms-of-service", "/learn", "/callback"];
        if(!pathNames.includes(path) && !path.startsWith("/forgot-password")) window.location.href = "/login";
        return null;
      }

      return data;
    } else if(method === 'POST' || method === 'PUT') {
      const requestOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie()}`},
        credentials: 'include',
        body: JSON.stringify(body)
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if(response.status === 401 && data.error) {
        const parts = window.location.href.split("/");
        const path = "/" + parts[parts.length-1];
        const pathNames = ["/", "/login", "/careers", "/register", 
          "/onboarding", "/forgot-password", "/education", "/userrs", 
          "/privacy-policy","/404", "/terms-of-service", "/learn"];
        if(!pathNames.includes(path) && !path.startsWith("/forgot-password")) window.location.href = "/login";
        return null;
      }

      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getCookie() {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; idToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (error) {
    console.log(error);
    return "";
  }
}

export default request;



/*

 * */
