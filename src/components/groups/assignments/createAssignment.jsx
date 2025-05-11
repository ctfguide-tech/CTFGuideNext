import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { Transition, Dialog } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { Menu } from '@headlessui/react';

import ForkChallenge from './fork-challenge';
import CreateChallenge from './create-challenge';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateGroup(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);

  const [latePenalty, setLatePenalty] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [assignmentPoints, setAssignmentPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Test');
  const [displayExistingChallenge, setDisplayExistingChallenge] =
    useState(false);
  const [displayCustomChallenge, setDisplayCustomChallenge] = useState(false);
  const [displayDynamicLab, setDisplayDynamicLab] = useState(false);

  const [errMessage, setErrMessage] = useState([]);

  const parseDate = () => {
    try {
      let dateStr = dueDate;
      let dateParts = dateStr.split('-');
      let inputDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      let currentDate = new Date();
      if (
        inputDate.getFullYear() === currentDate.getFullYear() &&
        inputDate.getMonth() === currentDate.getMonth() &&
        inputDate.getDate() === currentDate.getDate()
      ) {
        let givenTime = time;
        let givenDateTime = new Date(
          `${new Date().toISOString().split('T')[0]}T${givenTime}:00`
        );

        let time1 = currentDate.toString().split(' ')[4];
        let time2 = givenDateTime.toString().split(' ')[4];
        let [hours1, minutes1, seconds1] = time1.split(':').map(Number);
        let [hours2, minutes2, seconds2] = time2.split(':').map(Number);

        let date1 = new Date(2024, 0, 1, hours1, minutes1, seconds1);
        let date2 = new Date(2024, 0, 1, hours2, minutes2, seconds2);

        if (date1.getTime() < date2.getTime()) {
          return 1;
        } else if (date1.getTime() > date2.getTime()) {
          return -1;
        } else {
          return 0;
        }
      } else if (inputDate.getTime() < currentDate.getTime()) {
        return -1;
      } else {
        return 1;
      }
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  const validateForm = () => {
    if (!toast.isToastActive) {
      let errorList = [];
      if (!dueDate) {
        errorList.push('Invalid due date');
        toast.error('Invalid due date');
      }
      if (!time) {
        errorList.push('Invalid Time');
        toast.error('Invalid Time');
      }
      if (!selectedOption) {
        errorList.push('Please select a challenge option');
        toast.error('Please select a challenge option');
      }
      if (!selectedCategory) {
        errorList.push('Please select a category');
        toast.error('Please select a category');
      }
      if (!assignmentPoints < 0) {
        errorList.push('Points value cant be less than 0');
        toast.error('The assignment points value must be greater than or equal to 0.');
      }
      if (!title) {
        errorList.push('Invalid title');
        toast.error('Challenge title is invalid.');
      }

      if (parseDate() === -1) {
        errorList.push('Duedate isin the past');
        toast.error('Please choose a due date in the future.');
      }
      if (latePenalty === '') {
        errorList.push('Enter late penalty');
        toast.error('You haven\'t entered a late penalty. If you don\'t want to penalize late submissions, enter 0.');
      }
      setErrMessage(errorList);
      if (errorList.length > 0) {
        return false;
      } else return true;
    }
  };

  const existingChallengeStyles = `cursor-not-allowed opacity-50 bg-neutral-800 px-2 py-2 text-center border-2 border-neutral-800`;

  const onSubmit = async () => {
    if (!validateForm()) return;
    if (selectedOption === 'existingChallenge') {
      toast.error('Existing challenges are currently disabled');
      return;
    } else if (selectedOption === 'customChallenge') {
      setDisplayCustomChallenge(true);
    } else if(selectedOption === 'dynamicLab') {
      setDisplayDynamicLab(true);
    } else {
      setErrMessage('Please select an assignment type');
    }
  };

  if (displayExistingChallenge) {
    return (
      <ForkChallenge
        assignmentInfo={{
          classCode: props.classCode,
          title,
          description,
          time,
          dueDate,
          assignmentPoints,
          selectedCategory,
          latePenalty: parseInt(latePenalty),
          option: selectedOption
        }}
        setDisplay={setDisplayExistingChallenge}
      />
    );
  } else if (displayCustomChallenge) {
    return (
      <CreateChallenge
        assignmentInfo={{
          classCode: props.classCode,
          title,
          description,
          time,
          dueDate,
          assignmentPoints,
          selectedCategory,
          latePenalty: parseInt(latePenalty),
          option: selectedOption
        }}
        setDisplay={setDisplayCustomChallenge}
      />
    );
  } else if(displayDynamicLab) {
    return (
      <CreateChallenge
        assignmentInfo={{
          classCode: props.classCode,
          title,
          description,
          time,
          dueDate,
          assignmentPoints,
          selectedCategory,
          latePenalty: parseInt(latePenalty),
          option: selectedOption
        }}
        setDisplay={setDisplayDynamicLab}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Create Assignment - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="min-h-screen bg-neutral-900">
        <div className="mx-auto mt-10 max-w-6xl px-4">
          <button
            onClick={() => (window.location.href = ``)}
            className="mb-6 flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white transition hover:bg-neutral-700"
          >
            <i className="fa fa-arrow-left"></i> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Create an Assignment</h1>
            <p className="mt-2 text-neutral-400">Set up a new assignment for your students</p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Assignment Settings
                </h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Configure the basic details for your assignment.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="ex. Capture Flag 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Points
                    </label>
                    <input
                      type="number"
                      value={assignmentPoints}
                      onChange={(e) => setAssignmentPoints(parseInt(e.target.value))}
                      className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Category
                    </label>
                    <Menu as="div" className="relative mt-2">
                      <Menu.Button className="w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-left text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {selectedCategory || 'Select category'}
                      </Menu.Button>
                      <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 py-1 shadow-lg">
                        {['Test', 'Quiz', 'Homework', 'Assessment'].map((category) => (
                          <Menu.Item key={category}>
                            {({ active }) => (
                              <button
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full px-4 py-2 text-left text-sm ${
                                  active ? 'bg-neutral-700 text-white' : 'text-neutral-300'
                                }`}
                              >
                                {category}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter assignment description..."
                  />
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-medium text-white">Assignment Type</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className={`rounded-lg ${existingChallengeStyles}`}>
                      <div className="p-6 text-center">
                        <i className="fas fa-globe mb-4 text-3xl text-neutral-500"></i>
                        <h3 className="text-lg font-medium text-neutral-300">Existing Challenge</h3>
                        <p className="mt-2 text-sm text-neutral-400">
                          Coming soon - Choose from community challenges
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedOption('customChallenge')}
                      className={`cursor-pointer rounded-lg transition ${
                        selectedOption === 'customChallenge'
                          ? 'border-2 border-blue-500 bg-neutral-800'
                          : 'border border-neutral-800 bg-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="p-6 text-center">
                        <i className="fas fa-hand-sparkles mb-4 text-3xl text-orange-500"></i>
                        <h3 className="text-lg font-medium text-white">Custom Challenge</h3>
                        <p className="mt-2 text-sm text-neutral-400">
                          Create a new CTF challenge with AI-assisted grading
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedOption('dynamicLab')}
                      className={`cursor-pointer rounded-lg transition ${
                        selectedOption === 'dynamicLab'
                          ? 'border-2 border-blue-500 bg-neutral-800'
                          : 'border border-neutral-800 bg-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="p-6 text-center">
                        <i className="fas fa-robot mb-4 text-3xl text-green-500"></i>
                        <h3 className="text-lg font-medium text-white">Dynamic Lab</h3>
                        <p className="mt-2 text-sm text-neutral-400">
                          Create an AI-graded simulated security environment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Due Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-300">
                    Late Penalty (%)
                  </label>
                  <input
                    type="number"
                    value={latePenalty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setLatePenalty(value < 0 ? '0' : e.target.value);
                    }}
                    className="mt-2 w-full max-w-[200px] rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter penalty percentage"
                  />
                </div>

                <div className="mt-8">
                  <button
                    onClick={onSubmit}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <Footer />
    </>
  );
}
