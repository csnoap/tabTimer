document.getElementById('saveSettings').addEventListener('click', () => {
  const hours = parseInt(document.getElementById('hours').value) || 0;
  const minutes = parseInt(document.getElementById('minutes').value) || 0;
  const seconds = parseInt(document.getElementById('seconds').value) || 0;

  // Convert time to milliseconds
  const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

  if (totalMilliseconds > 0) {
    chrome.storage.sync.set({ inactivityTime: totalMilliseconds }, () => {
      alert('Settings saved!');
    });
  }
});

// Load saved settings
chrome.storage.sync.get(['inactivityTime'], (result) => {
  if (result.inactivityTime) {
    const totalMilliseconds = result.inactivityTime;
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);

    document.getElementById('hours').value = hours;
    document.getElementById('minutes').value = minutes;
    document.getElementById('seconds').value = seconds;
  }
});

// Connect to background and get tab activity data
const port = chrome.runtime.connect({ name: "popup" });

// Listen for tab data from background script
port.onMessage.addListener((message) => {
  const { tabsActivity, INACTIVITY_TIME } = message;
  displayTabsInfo(tabsActivity, INACTIVITY_TIME);
  // Start interval to update the displayed time
  setInterval(() => {
    displayTabsInfo(tabsActivity, INACTIVITY_TIME);
  }, 1000); // Update every second
});

// Function to display tabs' information
function displayTabsInfo(tabsActivity, INACTIVITY_TIME) {
  const container = document.getElementById('tabsInfo');
  container.innerHTML = ''; // Clear previous content

  const now = Date.now();
  for (const [tabId, lastActivity] of Object.entries(tabsActivity)) {
    chrome.tabs.get(parseInt(tabId), (tab) => {
      if (tab) {
        // Check if tab is "locked" (pinned, in group, or playing audio)
        const isLocked = tab.pinned || tab.groupId !== -1 || tab.audible;
        const shortenedUrl = tab.url.length > 20 ? `${tab.url.slice(0, 20)}...` : tab.url; // Shorten URL to 20 characters

        let tabRow = document.createElement('div');
        
        if (isLocked) {
          // Display 'Locked' for protected tabs
          tabRow.innerHTML = `${shortenedUrl} - Locked`;
        } else {
          // Calculate remaining time for non-locked tabs
          const remainingTime = INACTIVITY_TIME - (now - lastActivity);
          const remainingSeconds = Math.max(Math.floor(remainingTime / 1000), 0); // Convert to seconds

          // Format remaining time in hh:mm:ss
          const hours = Math.floor(remainingSeconds / 3600);
          const minutes = Math.floor((remainingSeconds % 3600) / 60);
          const seconds = remainingSeconds % 60;
          const timeFormatted = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

          tabRow.innerHTML = `${shortenedUrl} - ${timeFormatted} left`;
        }

        container.appendChild(tabRow);
      }
    });
  }
}

// Helper function to pad numbers to 2 digits
function padZero(num) {
  return num < 10 ? '0' + num : num;
}
