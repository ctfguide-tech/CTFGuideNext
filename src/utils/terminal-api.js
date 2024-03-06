
const buildTerminal = async (challenge, token) => {
  try {
    console.log('Creating a terminal ...');
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
      return [false, null];
    }

    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();
    let result = await reader.read();

    while (!result.done) {
      let stat = textDecoder.decode(result.value);
      if(stat.toLowerCase() !== 'terminal created') {
        console.log('Failed to create the terminal line 40');
        return [false, null];
      }
      result = await reader.read();
    }
    console.log('Terminal created successfully!');

    return [true, code+""];
  } catch (err) {
    console.log('Failed to create the terminal');
    console.log(err);
    return [false, null];
  }
};

const getStatus = async (id, jwt) => {
  try {
    console.log('Getting terminal status ...');
    const username = localStorage.getItem('username').toLowerCase();
    const url = `${process.env.NEXT_PUBLIC_TERM_URL}Terminal/getTerminalStatus?userID=${username}&terminalID=${id}&jwtToken=${jwt}`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return [null, false];
    }
    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();
    let result = await reader.read();

    let data = null;

    while (!result.done) {
      let stat = textDecoder.decode(result.value);
      data = JSON.parse(stat);
      console.log('Response from getTerminalStatus: ', data.status);
      if (data.status !== 'pending') {
        console.log('Termainl status is OK');
        console.log('Displaying terminal');
        return [data, true];
      }
      result = await reader.read();
    }
    return [data, null];
  } catch (err) {
    console.log(err);
    return [null, false];
  }
};
 
async function checkUserTerminal(token, challengeId) {
  console.log('checkUserTerminal...');
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


/*

Found a terminal for the user
User has a terminal but it is not for this challenge

Creating a terminal ...
Response from createTerminal:  Response {type: 'cors', url: 'https://file-system-run-qi6ms4rtoa-ue.a.run.app/Terminal/createTerminal', redirected: false, status: 200, ok: true, …}
Terminal created successfully!

checkUserTerminal...
Data from checkUserTerminal:  {url: null, serviceName: null, userName: null, password: null, maxMemoryLimit: null, …}
Creating a terminal ...

*/




/*
Terminal created successfully!
[code].jsx:134 Here is the code sir:  8118
terminal-api.js:57 Getting terminal status ...
terminal-api.js:60 
        
*/
