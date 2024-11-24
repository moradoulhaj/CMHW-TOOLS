export const calcSessions = (tagsToSplit) => {
  const lines = tagsToSplit.split("\n");
  if (lines.length === 0) {
    return;
  }

  // Split the first line by tab to detect the number of sessions
  const firstLine = lines[0];
  const sessions = firstLine.split("\t");
  return sessions.length / 2; // return the number of sessions
};

export const parseNumberTagPairs = (line) => {
  // Split the input by tabs to capture numbers, tags, and empty fields
  const elements = line.split("\t");
  // Initialize an empty result array to store pairs
  const result = [];

  // Iterate over elements two at a time
  for (let i = 0; i < elements.length; i += 2) {
    // Get the current number and tag, or use empty strings if missing
    const number = elements[i] || "";
    const tag = elements[i + 1] || "";
    result.push([number, tag]);
  }

  return result;
};
// to split tags by sesions
export const collectData = (lines, sessionsNumber) => {
  // Initialize the grouped structure with empty subarrays for each position
  const groupedProfilesAndTags = Array.from({ length: sessionsNumber }, () => []);

  // Track whether we've encountered an empty pair for each column
  const stopPush = Array(sessionsNumber).fill(false);

  // Populate the grouped structure by column
  lines.forEach((pairs) => {
    pairs.forEach((pair, index) => {
      // Only push if we haven't encountered an empty pair in this column
      if (!stopPush[index]) {
        if (pair[0] === "" && pair[1] === "") {
          stopPush[index] = true; // Mark this column to stop pushing further
        } else {
          groupedProfilesAndTags[index].push(pair);
        }
      }
    });
  });
  
  return groupedProfilesAndTags;
};

// Function to split each session's pairs into chunks based on dropNumbers
export const splitSessionsByDrops = (collectedData, dropNumbers) => {
  return collectedData.map(session => {
    const chunks = [];
    const seedsPerDropForSession = Math.ceil(session.length / dropNumbers);

    // Loop through the session and create chunks
    for (let i = 0; i < session.length; i += seedsPerDropForSession) {
      const chunk = session.slice(i, i + seedsPerDropForSession);
      chunks.push(chunk);
    }

    return chunks;
  });
};
