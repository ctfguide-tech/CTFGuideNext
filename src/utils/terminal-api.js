
const buildTerminal = async (challenge, token) => {
  try {
    console.log('Creating a terminal');
    let min = 1000;
    let max = 9999;

    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    const url = process.env.NEXT_PUBLIC_TERM_URL + 'Terminal/createTerminal';

    const body = {
      jwtToken: token,
      TerminalGroupName: 'school-class-session',
      TerminalID: code,
      classID: 'psu101',
      organizationName: 'PSU',
      userID: localStorage.getItem('username').toLowerCase(),
      challengeID: challenge.id,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);
    if(!response.ok) {
      return null;
    }
    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();
    let result = await reader.read();

    let data = null;

    while (!result.done) {
      let stat = textDecoder.decode(result.value);
      data = JSON.parse(stat);
      result = await reader.read();
    }

    if (response.ok && data && data.url) {
      console.log('The terminal was created successfully');
      return data;

    } else {
      console.log('Failed to create the terminal');
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getStatus = async (id) => {
  try {
    console.log('Getting terminal status');
    const username = localStorage.getItem('username').toLowerCase();
    const url = `${process.env.NEXT_PUBLIC_TERM_URL}Terminal/getTerminalStatus?userID=${username}&terminalID=${id}`;
    const response = await fetch(url, { method: 'GET' });

    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();
    let result = await reader.read();

    while (!result.done) {
      let stat = textDecoder.decode(result.value);
      console.log('Response from getTerminalStatus: ', stat);
      if (stat !== 'active') {
        throw new Error('Not active');
      }
      result = await reader.read();
    }

    if (response.ok) {
      console.log('Termainl status is OK');
      console.log('Displaying terminal');
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};

// Check if user has terminal
async function checkUserTerminal(token, challengeId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_TERM_URL}Terminal/checkUserTerminal?jwtToken=${token}&challengeID=${challengeId}`;
    const response = await fetch(url, { method: 'GET' });
    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();
    let result = await reader.read();
    let data = null;
    while (!result.done) {
      let stat = textDecoder.decode(result.value);
      data = JSON.parse(stat);
      result = await reader.read();
    }
    if(data && data.url) {
      return data;
    }
    return null;
  } catch(err) {
    console.log(err);
    return null;
  }
}

const api = { buildTerminal, getStatus, checkUserTerminal};
export default api;
