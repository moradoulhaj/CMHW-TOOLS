import React, { useState } from 'react';

function ProxiesHelperNew() {
  const [sessionProfiles, setSessionProfiles] = useState({});
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [fileGenerated, setFileGenerated] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsedSessions = parseSessions(text);
        setSessionProfiles(parsedSessions);
        const total = Object.values(parsedSessions).reduce((sum, arr) => sum + arr.length, 0);
        setTotalProfiles(total);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .txt file');
    }
  };

  const parseSessions = (text) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim().replace(/^"+|"+$/g, ''))
      .filter(Boolean);

    const sessions = {};
    let currentSession = null;

    lines.forEach((line) => {
      if (/^[A-Za-z0-9_]+$/.test(line) && isNaN(Number(line))) {
        currentSession = line;
        sessions[currentSession] = [];
      } else if (!isNaN(Number(line)) && currentSession) {
        sessions[currentSession].push(line);
      }
    });

    return sessions;
  };

  const generatePrefix = (sessions) => {
    const entityName = sessions[0].split("_")[0];
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${entityName}_${randomPart}`;
  };

  const generateTxtFile = () => {
    
    const Simpleproxies = manualInput.split('\n').map(p => p.trim()).filter(Boolean);
    const proxies=Simpleproxies.map((p)=>{
      if(p.includes(":")){
        return p
      }else {
        return `${p}:92`
      }

    })
    // console.log(proxies)
    const sessions = Object.keys(sessionProfiles);
    const profilesBySession = sessionProfiles;

    const nonEmptySessions = sessions.filter(s => (profilesBySession[s] || []).length > 0);
    const totalProfilesCount = nonEmptySessions.reduce(
      (sum, s) => sum + profilesBySession[s].length,
      0
    );

    if (proxies.length !== totalProfilesCount) {
      alert(`Number of proxies (${proxies.length}) does not match number of profiles (${totalProfilesCount})`);
      return;
    }

    let proxyIndex = 0;
    let content = '';

    nonEmptySessions.forEach(session => {
      content += `${session}\n`;
      const profiles = profilesBySession[session];
      profiles.forEach(profile => {
        content += `${profile}#${proxies[proxyIndex++]}\n`;
      });
    });

    const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const Rndmprefix = generatePrefix(sessions);
    link.download = `${Rndmprefix}.txt`;

    setPrefix(Rndmprefix);
    setFileGenerated(true);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
  <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl shadow-gray-200/50">
    {/* Header */}
    <div className="p-6 border-b border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        Proxy Profile Generator
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Upload a profile list or manually input proxies for mapping.
      </p>
    </div>

    {/* Main Content Area */}
    <div className="p-6 space-y-6">
      {/* Action Card: Upload & Manual Input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.882-6.524 4.001 4.001 0 017.301-1.258A5.5 5.5 0 0115.5 16H18a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2h1"
            />
          </svg>
          Proxy Sources
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="relative transition-all duration-200 ease-in-out">
            <span className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Profile File (.txt)
            </span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              setShowModal(true);
              setFileGenerated(false);
            }}
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 ease-in-out disabled:bg-green-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            disabled={totalProfiles === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Manual Proxy Input
          </button>
        </div>
      </div>

      {/* Status Card: Profile Count */}
      {totalProfiles > 0 && (
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-800 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="font-semibold text-lg">Profiles Ready for Proxy Assignment</p>
          </div>
          <span className="text-2xl font-bold bg-indigo-600 text-white px-4 py-1 rounded-full shadow-md">
            {totalProfiles}
          </span>
        </div>
      )}
    </div>

    {/* Modal for Manual Input - Improved Design */}
    {showModal && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl transform scale-100 transition-transform duration-300">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800">
              Manual Proxy Input
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg p-4 resize-y mb-4 text-sm font-mono placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              placeholder={`Paste your proxies here, one per line (e.g., IP:Port:User:Pass)...\nYou need to provide exactly ${totalProfiles} proxies.`}
            />

            {/* Status Counter */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm">
                <span className="text-gray-600 font-medium">Proxies Entered:</span>
                <span
                  className={`ml-2 text-lg font-bold ${
                    manualInput.split('\n').filter(Boolean).length === totalProfiles
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {manualInput.split('\n').filter(Boolean).length}
                </span>
                <span className="text-gray-500"> / {totalProfiles} required</span>
              </div>
            </div>

            {/* Generated Prefix Display */}
            {fileGenerated && (
              <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 mb-6">
                <p className="font-bold mb-2">✅ Success! Generated Profile Prefix:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={prefix}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm w-full font-mono mr-2 focus:outline-none"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(prefix)}
                    className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                  >
                    Copy Prefix
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer (Actions) */}
          <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={generateTxtFile}
              disabled={manualInput.split('\n').filter(Boolean).length !== totalProfiles}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                manualInput.split('\n').filter(Boolean).length === totalProfiles
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                  : 'bg-indigo-400 cursor-not-allowed'
              }`}
            >
              Generate File
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
}

export default ProxiesHelperNew;
