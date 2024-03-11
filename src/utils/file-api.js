
export const getFile = async (fileId) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}/upload/getFile?fileID=${fileId}`;
  const requestOptions = {
    method: 'GET', 
  };
  const response = await fetch(url, requestOptions);
  console.log('response', response);
  //return response;
}

export const getFileName = async (fileId) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}/upload/getFileName?fileID=${fileId}`;
  const requestOptions = {
    method: 'GET', 
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
    body: JSON.stringify(body),
  };

  const response = await fetch(url, requestOptions);
  console.log('response', response);

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
  console.log('data', data);
  return data;
}

export const deleteFiles = async (fileIds, token) => {
  const url = `${process.env.NEXT_PUBLIC_TERM_URL}upload/delete`;
  const parsedIds = fileIds.map((id) => parseInt(id));

  const requestOptions = {
    method: 'POST', 
    body: JSON.stringify({ fileIDs: parsedIds, jwtToken: token}),
  };

  const response = await fetch(url, requestOptions);
  console.log('response', response);
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
