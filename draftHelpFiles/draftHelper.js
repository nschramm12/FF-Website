

let draftRankings = [];
let yourRankings = [];

function loadCSVFile(file, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open('GET', file, true);
  xhr.send();
}

function parseCSVData(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === headers.length) {
      const obj = {};
      obj.rank = currentLine[0].trim();
      obj.name = currentLine[1].trim();
      data.push(obj);
    }
  }

  return data;
}

function playerPicked(playerName) {
  // Remove the picked player from the draft rankings
  draftRankings = draftRankings.filter(player => player.name !== playerName);

  // Remove the picked player from your rankings
  yourRankings = yourRankings.filter(player => player.name !== playerName);

  // Clear the previous best pick list
  const prismRankingsList = document.getElementById('yourRankingsItems');
  prismRankingsList.innerHTML = '';

  // Display the updated best available players list
  for (let i = 0; i < yourRankings.length; i++) {
    const player = yourRankings[i];
    const listItem = document.createElement('li');
    listItem.textContent = `${player.rank}.) ${player.name}`;
    prismRankingsList.appendChild(listItem);
  }

  // Clear the previous player buttons
  const pickButtonsDiv = document.getElementById('pickButtons');
  pickButtonsDiv.innerHTML = '';

  // Create pick buttons for the remaining players in the draft rankings
  for (let i = 0; i < draftRankings.length; i++) {
    const player = draftRankings[i];
    const pickButton = document.createElement('button');
    pickButton.className = 'pickButton';
    pickButton.textContent = player.name;
    pickButton.addEventListener('click', () => {
      playerPicked(player.name);
      pickButton.remove();
    });
    pickButtonsDiv.appendChild(pickButton);
  }

  // Update the new list with the top 8 players sorted by your rankings
  updateTopPlayersList();
}

function updateTopPlayersList() {
  // Get the top 8 players from the draft rankings
  const topPlayers = draftRankings.slice(0, 10);

  // Sort the top players based on your rankings
  topPlayers.sort((a, b) => {
    const aRanking = yourRankings.findIndex(player => player.name === a.name);
    const bRanking = yourRankings.findIndex(player => player.name === b.name);
    return aRanking - bRanking;
  });

  // Clear the previous top players list
  const topPlayersList = document.getElementById('topPlayersList');
  topPlayersList.innerHTML = '';

  // Display the updated top players list
  for (let i = 0; i < topPlayers.length; i++) {
    const player = topPlayers[i];
    const listItem = document.createElement('li');
    listItem.textContent = `${i + 1}.)   ${player.name}`;
    topPlayersList.appendChild(listItem);
  }
}

// Create pick buttons and display best available players
function createPickButtons() {
  const pickButtonsDiv = document.getElementById('pickButtons');
  pickButtonsDiv.innerHTML = ''; // Clear the previous buttons

  for (let i = 0; i < draftRankings.length; i++) {
    const player = draftRankings[i];
    const pickButton = document.createElement('button');
    pickButton.className = 'pickButton';
    pickButton.textContent = player.name; // Assign the player name to the button text
    pickButton.addEventListener('click', () => {
      pickButton.remove(); // Remove the clicked button from display
    });
    pickButtonsDiv.appendChild(pickButton);
  }

  // Update the new list with the top 8 players sorted by your rankings
  updateTopPlayersList();
}

loadCSVFile('espnRanks.csv', function(csvData) {
  const parsedDraftRankings = parseCSVData(csvData);
  draftRankings = parsedDraftRankings;

  loadCSVFile('prismRankings.csv', function(csvData) {
    const parsedYourRankings = parseCSVData(csvData);
    yourRankings = parsedYourRankings;

    createPickButtons();
    playerPicked('');
  });
});


// Show the instruction popup
function showInstructionPopup() {
  const instructionPopup = document.getElementById('instructionPopup');
  instructionPopup.style.display = 'block';
}

// Close the instruction popup
function closeInstructionPopup() {
  const instructionPopup = document.getElementById('instructionPopup');
  instructionPopup.style.display = 'none';
}

// Add event listener to the close button
document.getElementById('closeButton').addEventListener('click', closeInstructionPopup);

// Show the instruction popup when the page is loaded
window.addEventListener('load', showInstructionPopup);