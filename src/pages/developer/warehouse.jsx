import Head from 'next/head';
import Link from 'next/link';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { useState, useEffect, useContext, useRef } from 'react';
import { Context } from '@/context';

function generateMockTerminalData(count = 200) {
  // Generate random UUIDs for user IDs
  function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const userIds = Array.from({length: 10}, () => randomUUID());
  const challengeIds = Array.from({length: 8}, () => randomUUID());
  const commands = [
    'ls -la', 'cat flag.txt', 'whoami', 'pwd', 'echo Hello', 'cd /home', 'rm -rf /tmp/*', 'ps aux', 'top', 'nano notes.txt',
    'curl http://example.com', 'python3 exploit.py', 'gcc main.c -o main', 'docker ps', 'exit', 'chmod +x script.sh', 'git status', 'htop', 'ifconfig', 'ssh user@host'
  ];
  const results = [
    'Success', 'Permission denied', 'File not found', 'Segmentation fault', 'Flag: CTFGuide{example}', 'No such file or directory', 'Operation not permitted', 'Command not found', 'Process killed', 'Done'
  ];
  const data = [];
  for (let i = 0; i < count; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const challengeId = challengeIds[Math.floor(Math.random() * challengeIds.length)];
    const command = commands[Math.floor(Math.random() * commands.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 100000000)).toLocaleString();
    data.push({
      id: i + 1,
      userId,
      command,
      result,
      timestamp,
      challengeId,
    });
  }
  return data;
}

// Generate a mock command history for each userId
function generateUserHistory(userId, allData) {
  // Filter allData for this userId, sort by timestamp descending
  return allData
    .filter(row => row.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Drawer styles for slide-in effect
const drawerBase = "fixed top-0 right-0 h-full w-full max-w-4xl z-50 transition-transform duration-300 ease-in-out bg-neutral-900 shadow-xl border-l border-neutral-800";
const drawerOpen = "translate-x-0";
const drawerClosed = "translate-x-full";

export default function Forgot() {
  const { role } = useContext(Context);
  if (role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-2xl text-red-500 font-bold">Access Denied: Admins only.</div>
      </div>
    );
  }
  const [showTable, setShowTable] = useState(false);
  const [terminalData, setTerminalData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [replayActive, setReplayActive] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayPaused, setReplayPaused] = useState(false);
  const replayIntervalRef = useRef(null);

  const handleRenderView = () => {
    setTerminalData(generateMockTerminalData(200));
    setShowTable(true);
  };

  const handleCommandClick = (userId) => {
    setSelectedUserId(userId);
    setShowHistoryModal(true);
  };

  const closeModal = () => {
    setShowHistoryModal(false);
    setSelectedUserId(null);
    setReplayActive(false);
    setReplayIndex(0);
    setReplayPaused(false);
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
  };

  // Terminal replay logic
  const startReplay = () => {
    setReplayActive(true);
    setReplayPaused(false);
    setReplayIndex(0);
  };

  const pauseReplay = () => {
    setReplayPaused(true);
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
  };

  const resumeReplay = () => {
    setReplayPaused(false);
  };

  // Effect to handle replay typing
  useEffect(() => {
    if (!replayActive || replayPaused || !selectedUserId) return;
    const history = generateUserHistory(selectedUserId, terminalData);
    if (replayIndex >= history.length) return;
    replayIntervalRef.current = setInterval(() => {
      setReplayIndex(idx => {
        if (idx + 1 >= history.length) {
          clearInterval(replayIntervalRef.current);
          return idx + 1;
        }
        return idx + 1;
      });
    }, 900);
    return () => clearInterval(replayIntervalRef.current);
  }, [replayActive, replayPaused, replayIndex, selectedUserId, terminalData]);

  // Reset replay when userId changes
  useEffect(() => {
    setReplayActive(false);
    setReplayIndex(0);
    setReplayPaused(false);
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
  }, [selectedUserId]);

  return (
    
    <>
      <Head>
        <title>CTFGuide Warehouse</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div
        style={{ fontFamily: 'Poppins, sans-serif' }}
        className="px-20 py-10 mt-14 text-white"
      >
        
            <h1 className='text-4xl font-semibold'><i class="fas fa-project-diagram mr-4"></i>CTFGuide <span className='text-blue-500'>Data Warehouse</span></h1>
            
            <hr className='border-neutral-800 mt-4'></hr>

            <h1 className='text-xl mt-4'>Choose a service data source</h1>
            <select className='mt-2 py-2 pr-10 rounded-lg bg-neutral-800 border border-neutral-800 text-white'>
                <option value='' selected>Terminal Infrastructure</option>

            </select>

            <button className='ml-4 bg-blue-600 text-center mx-auto  px-2 py-1 rounded-full' onClick={handleRenderView}>Render View</button>
            
            <h1 className='text-xl mt-4'>Output:</h1>

            {showTable && (
              <div className='mt-6 max-h-[500px] overflow-auto rounded-lg border border-neutral-800 bg-neutral-900/80 shadow-lg'>
                <table className='min-w-full text-sm text-white'>
                  <thead className='bg-neutral-800 sticky top-0'>
                    <tr>
                      <th className='px-4 py-2 text-left'>#</th>
                      <th className='px-4 py-2 text-left'>User ID  - Anonymous</th>
                      <th className='px-4 py-2 text-left'>Command</th>
                      <th className='px-4 py-2 text-left'>Result</th>
                      <th className='px-4 py-2 text-left'>Challenge ID</th>
                      <th className='px-4 py-2 text-left'>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terminalData.map(row => (
                      <tr key={row.id} className='odd:bg-neutral-800/40 even:bg-neutral-900/40 hover:bg-blue-900/30 transition'>
                        <td className='px-4 py-2'>{row.id}</td>
                        <td className='px-4 py-2 font-mono text-yellow-300'>{row.userId}</td>
                        <td className='px-4 py-2 font-mono text-blue-300 cursor-pointer underline hover:text-blue-400' onClick={() => handleCommandClick(row.userId)} title='Show full terminal history'>
                          {row.command}
                        </td>
                        <td className='px-4 py-2'>{row.result}</td>
                        <td className='px-4 py-2 font-mono text-pink-300'>{row.challengeId}</td>
                        <td className='px-4 py-2 text-xs text-neutral-400'>{row.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal for terminal history */}
            {showHistoryModal && selectedUserId && (
              <>
                {/* Overlay */}
                <div className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300" onClick={closeModal}></div>
                {/* Drawer */}
                <div className={`${drawerBase} ${showHistoryModal ? drawerOpen : drawerClosed}`}
                  style={{ boxShadow: '0 0 32px 0 #000a', width: '100%', maxWidth: '64rem' }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                      <h2 className="text-xl font-bold text-white">Terminal History</h2>
                      <button className="text-gray-400 hover:text-red-400 text-2xl" onClick={closeModal}>&times;</button>
                    </div>
                    <div className="px-6 pt-2 pb-6">
                      <div className="mb-2 text-sm text-neutral-400">User ID: <span className='font-mono text-yellow-300'>{selectedUserId}</span></div>
                      <div className="max-h-[70vh] overflow-auto border border-neutral-800 rounded bg-neutral-950/80 p-4">
                        <table className="min-w-full text-sm text-white">
                          <thead className="bg-neutral-800 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left">Timestamp</th>
                              <th className="px-3 py-2 text-left">Command</th>
                              <th className="px-3 py-2 text-left">Result</th>
                              <th className="px-3 py-2 text-left">Challenge ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generateUserHistory(selectedUserId, terminalData).map((entry, idx) => (
                              <tr key={entry.id} className="odd:bg-neutral-800/40 even:bg-neutral-900/40">
                                <td className="px-3 py-2 text-xs text-neutral-400">{entry.timestamp}</td>
                                <td className="px-3 py-2 font-mono text-blue-300">{entry.command}</td>
                                <td className="px-3 py-2">{entry.result}</td>
                                <td className="px-3 py-2 font-mono text-pink-300">{entry.challengeId}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Terminal Replay Controls */}
                      <div className="mt-6">
                        <div className="flex items-center gap-4 mb-2">
                          <button
                            className="px-4 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 font-mono"
                            onClick={startReplay}
                            disabled={replayActive && !replayPaused}
                          >
                            ▶ Replay
                          </button>
                          <button
                            className="px-4 py-1 bg-yellow-700 text-white rounded hover:bg-yellow-800 font-mono"
                            onClick={pauseReplay}
                            disabled={!replayActive || replayPaused}
                          >
                            ❚❚ Pause
                          </button>
                          <button
                            className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800 font-mono"
                            onClick={resumeReplay}
                            disabled={!replayActive || !replayPaused}
                          >
                            ► Resume
                          </button>
                        </div>
                        {replayActive && (
                          <div className="bg-black border border-neutral-800 rounded p-4 font-mono text-green-400 text-sm max-h-64 overflow-auto" style={{minHeight:'120px'}}>
                            {generateUserHistory(selectedUserId, terminalData).slice(0, replayIndex).map((entry, idx) => (
                              <div key={idx}>
                                <span className="text-blue-400">$</span> {entry.command}
                                <br />
                                <span className="text-neutral-400">{entry.result}</span>
                                <br />
                              </div>
                            ))}
                            {replayIndex >= generateUserHistory(selectedUserId, terminalData).length && (
                              <div className="text-green-500 mt-2">Replay complete.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='mt-40'>
                &copy; CTFGuide Corporation 2024
            </div>
      </div>
    </>
  );
}
