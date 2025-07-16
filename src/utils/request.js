const request = async (url, req_method, body) => {
  try {
    let method = req_method.toUpperCase();
    if (method === 'GET' || method === 'DELETE') {
      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie()}`,
        },
        credentials: 'include',
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.status === 401 && data.error) {
        const url = new URL(window.location.href);
        const path = url.pathname;
        const pathNames = [
          '/',
          '/login',
          '/careers',
          '/register',
          '/onboarding',
          '/forgot-password',
          '/education',
          '/userrs',
          '/privacy-policy',
          '/404',
          '/terms-of-service',
          '/learn',
        ];

        // Check if it's a challenge page (UUID format)
        const challengePathRegex =
          /^\/challenges\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
        const isChallengePage = challengePathRegex.test(path);

        if (
          !pathNames.includes(path) &&
          !path.startsWith('/forgot-password') &&
          !isChallengePage
        ) {
          window.location.href = '/login';
        }
        return { success: false, error: 'Authentication required' };
      }

      return data;
    } else if (method === 'POST' || method === 'PUT') {
      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie()}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (response.status === 401 && data.error) {
        const url = new URL(window.location.href);
        const path = url.pathname;
        const pathNames = [
          '/',
          '/login',
          '/careers',
          '/register',
          '/onboarding',
          '/forgot-password',
          '/education',
          '/userrs',
          '/privacy-policy',
          '/404',
          '/terms-of-service',
          '/learn',
        ];

        // Check if it's a challenge page (UUID format)
        const challengePathRegex =
          /^\/challenges\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
        const isChallengePage = challengePathRegex.test(path);

        if (
          !pathNames.includes(path) &&
          !path.startsWith('/forgot-password') &&
          !isChallengePage
        ) {
          window.location.href = '/login';
        }
        return { success: false, error: 'Authentication required' };
      }

      return data;
    } else {
      return { success: false, error: 'Invalid request method' };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message || 'Network error occurred' };
  }
};

export function getCookie() {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; idToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (error) {
    console.log(error);
    return '';
  }
}

export default request;

/*

 * */
