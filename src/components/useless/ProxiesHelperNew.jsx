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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Proxies Helper</h2>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <label className="cursor-pointer transition-transform hover:scale-105">
            <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block shadow-md">
              Upload File
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            disabled={totalProfiles === 0}
          >
            Manual Input
          </button>
        </div>

        {totalProfiles > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-800">
            <strong>Total Profiles Detected:</strong> {totalProfiles}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Manual Proxy Input</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded-lg p-3 resize-y mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Paste your proxies here, one per line...\nYou need to provide exactly ${totalProfiles} proxies.`}
              />

              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  <span className={`font-medium ${manualInput.split('\n').filter(Boolean).length === totalProfiles ? 'text-green-600' : 'text-red-600'}`}>
                    {manualInput.split('\n').filter(Boolean).length} proxies entered
                  </span>
                  <span> / {totalProfiles} required</span>
                </div>
              </div>

              {fileGenerated && (
                <div className="bg-green-50 border border-green-300 text-green-800 rounded-md p-3 mb-4">
                  <p className="font-semibold">Generated Prefix:</p>
                  <div className="flex items-center mt-1">
                    <input
                      type="text"
                      readOnly
                      value={prefix}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-full mr-2"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(prefix)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateTxtFile}
                  disabled={manualInput.split('\n').filter(Boolean).length !== totalProfiles}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${manualInput.split('\n').filter(Boolean).length === totalProfiles ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'}`}
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
