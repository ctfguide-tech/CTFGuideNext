
export const getFile = async (fileId, filename) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}files/get?fileID=${fileId}`;
  const requestOptions = {
    method: 'GET', 
    headers: {"Content-Type": "application/json"},
  };
  const response = await fetch(url, requestOptions);

  if(!response.ok) {
    console.error('Error during file download:', response);
    return;
  }

  const blob = await response.blob();

  const tempLink = document.createElement('a');
  tempLink.href = URL.createObjectURL(blob);
  tempLink.setAttribute('download', filename);
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);

  setTimeout(() => {
    URL.revokeObjectURL(tempLink.href);
  }, 100);
}

export const getFileName = async (fileId) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}/upload/getFileName?fileID=${fileId}`;
  const requestOptions = {
    method: 'GET', 
    headers: {"Content-Type": "application/json"},
  };
  const response = await fetch(url, requestOptions);

  const readableStream = response.body;
  const textDecoder = new TextDecoder();
  const reader = readableStream.getReader();

  let result = await reader.read();

  let name = null;
  while (!result.done) {
    name = textDecoder.decode(result.value);
    result = await reader.read();
  }
  return name;
};


// copies a list of files from the db
export const getNewFileIds = async (oldFileIds, token) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}upload/duplicate`;
  const parsedIds = oldFileIds.map((id) => parseInt(id));

  const body = {
    jwtToken: token,
    fileIDs: parsedIds
  };

  const requestOptions = {
    method: 'POST', 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);

  if(!response.ok) {
    console.error('Error during file duplication:', response);
    return null;
  }

  const readableStream = response.body;
  const textDecoder = new TextDecoder();
  const reader = readableStream.getReader();

  let result = await reader.read();

  let data = [];
  while (!result.done) {
    let fileId = textDecoder.decode(result.value);
    data.push(fileId);
    result = await reader.read();
  }

  const fileIds = JSON.parse(data);
  const backToStringIds = fileIds.map((id) => id.toString());
  return backToStringIds;
}

export const deleteFiles = async (fileIds, token) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}upload/delete`;
  const parsedIds = fileIds.map((id) => parseInt(id));

  const requestOptions = {
    method: 'POST', 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ fileIDs: parsedIds, jwtToken: token}),
  };

  const response = await fetch(url, requestOptions);
  //console.log('response', response);
  return response.ok;
};



// add a file to the db
const fileApi = async (token, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jwtToken', token);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TERM_URL}upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const readableStream = response.body;
    const textDecoder = new TextDecoder();
    const reader = readableStream.getReader();

    let result = await reader.read();

    let fileId = '';
    while (!result.done) {
      fileId = textDecoder.decode(result.value);
      result = await reader.read();
    }

    if (response.ok) {
      console.log('File uploaded successfully!');
      return fileId;
    } else {
      console.error('File upload failed.');
      return null;
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    return null;
  }
};

export default fileApi;
