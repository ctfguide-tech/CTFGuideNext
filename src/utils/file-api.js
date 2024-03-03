
const fileApi = async (token, selectedFile) => {
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jwtToken', token);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TERM_URL}/upload`,
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
