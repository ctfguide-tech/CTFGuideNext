import { useState } from 'react';

const baseUrl = `http://localhost:3001`;
const CreateAssignment = ({ classroom }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createAssignment = async () => {
    try {
      const classroomId = classroom.id;
      const url = `${baseUrl}/classroom-assignments/create-assignment`;

      const assignmentData = {
        name,
        description,
        dueDate,
        classroomId,
      };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assignmentData }),
      });
      const data = await response.json();
      console.log(data.message);
      if (data.success) {
        // window.location.href = '/';
      }
    } catch (err) {
      console.log(err);
    }
  };
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  return (
    <>
      <input
        style={inputStyle}
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Name..."
      />
      <input
        onChange={(e) => setDescription(e.target.value)}
        style={inputStyle}
        value={description}
        placeholder="Description"
      />
      <input
        type="date"
        id="dueDate"
        style={inputStyle}
        onChange={(e) => setDueDate(e.target.value)}
        value={dueDate}
        placeholder="Due Date"
      />
      <button style={buttonStyle}>Use existing challenge</button>
      <button style={buttonStyle}>Create new challenge</button>
      <button style={buttonStyle} onClick={createAssignment}>
        Submit
      </button>
    </>
  );
};
export default CreateAssignment;
