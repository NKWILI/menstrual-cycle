// DOM reference to display history
const displayTracker = document.getElementById("historyList");

// Display history if available
const storedCycle = JSON.parse(localStorage.getItem("history")) || [];

function displayHistory(arr) {
  if (arr.length === 0) {
    displayTracker.innerHTML = `
      <div class="history-card">
        <p>No data available</p>
      </div>
    `;
  } else {
    arr.forEach((element) => {
      displayTracker.innerHTML += `
        <div class="history-card">
          <p><strong>Ovulation Day:</strong> ${element.ovulationday}</p>
          <p><strong>Next Period:</strong> ${element.nextperiod}</p>
          <p><strong>Cycle Length:</strong> ${element.cyclelength}</p>
        </div>
      `;
    });
  }
}

// Call display function on load
displayHistory(storedCycle);

// Main calculation function
function calculateCycle() {
  const lastPeriod = new Date(document.getElementById('lastPeriod').value);
  const cycleLength = parseInt(document.getElementById('cycleLength').value);

  if (!lastPeriod || isNaN(cycleLength)) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

  const ovulation = new Date(lastPeriod);
  ovulation.setDate(lastPeriod.getDate() + (cycleLength - 14));

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 5);

  const fertileEnd = new Date(ovulation);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const currentDate = new Date();
  const daysPassed = Math.floor((currentDate - lastPeriod) / 86400000);
  const currentCycleDay = daysPassed + 1;
  const progressInPercentage = Math.min(Math.round((daysPassed / cycleLength) * 100), 100);

  // Display results
  const isInFertileWindow = currentDate >= fertileStart && currentDate <= fertileEnd;
  const fertileAlertHTML = isInFertileWindow 
    ? `<div class="fertility-alert">🌸 Vous êtes dans votre fenêtre fertile aujourd’hui !</div>` 
    : "";

  document.getElementById('result').innerHTML = `
    <h3>Résultats</h3>
    <p><strong>Prochaine période :</strong> ${nextPeriod.toLocaleDateString('fr-FR', options)}</p>
    <p><strong>Jour d'ovulation :</strong> ${ovulation.toLocaleDateString('fr-FR', options)}</p>
    <p><strong>Fenêtre fertile :</strong> du ${fertileStart.toLocaleDateString('fr-FR', options)} au ${fertileEnd.toLocaleDateString('fr-FR', options)}</p>
    <p><strong>Progression du cycle :</strong> ${progressInPercentage}%</p>
    <p><strong>Jour actuel: </strong>${currentCycleDay} / ${cycleLength}</p>
    ${fertileAlertHTML}
    <div class="progress-bar-container">
      <div class="progress-bar-fill" id="cycleProgressBar"></div>
    </div>
  `;

  if (isInFertileWindow) {
    document.getElementById("fertility-sound").play();
  }

  const progressBar = document.getElementById('cycleProgressBar');
  progressBar.style.width = `${progressInPercentage}%`;
  progressBar.style.background = progressInPercentage <= 30
    ? "#28a745"
    : progressInPercentage <= 75
    ? "#fd7e14"
    : "#dc3545";

  // Update localStorage with new data
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (history.length < 6) {
    history.push({
      ovulationday: ovulation.toLocaleDateString('fr-FR', options),
      nextperiod: nextPeriod.toLocaleDateString('fr-FR', options),
      cyclelength: cycleLength
    });
    localStorage.setItem("history", JSON.stringify(history));
  }
}

// Clear history function
function clearHistory() {
  localStorage.removeItem("history");
  displayTracker.innerHTML = `
    <div class="history-card">
      <p>No data available</p>
    </div>
  `;
}
