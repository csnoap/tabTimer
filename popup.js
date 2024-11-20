document.getElementById('saveSettings').addEventListener('click', () => {
  const inactivityTime = parseInt(document.getElementById('inactivityTime').value);
  if (inactivityTime > 0) {
    chrome.storage.sync.set({ inactivityTime: inactivityTime * 60 * 1000 }, () => {
      alert('Settings saved!');
    });
  }
});

// Load saved settings
chrome.storage.sync.get(['inactivityTime'], (result) => {
  if (result.inactivityTime) {
    document.getElementById('inactivityTime').value = result.inactivityTime / 60000;
  }
});

// Connect to background and get tab activity data
const port = chrome.runtime.connect({ name: "popup" });

// Listen for tab data from background script
port.onMessage.addListener((message) => {
  const { tabsActivity, INACTIVITY_TIME } = message;
  displayTabsInfo(tabsActivity, INACTIVITY_TIME);
  // Start interval to update the displayed seconds
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
        const shortenedUrl = tab.url.length > 20 ? `${tab.url.slice(0, 20)}...` : tab.url; // Shorten URL

        let tabRow = document.createElement('div');
        
        if (isLocked) {
          // Display 'Locked' for protected tabs
          tabRow.innerHTML = `${shortenedUrl} - Locked`;
        } else {
          // Calculate remaining time for non-locked tabs
          const remainingTime = INACTIVITY_TIME - (now - lastActivity);
          const remainingSeconds = Math.max(Math.floor(remainingTime / 1000), 0); // Convert to seconds
          tabRow.innerHTML = `${shortenedUrl} - ${remainingSeconds} second(s) left`;
        }

        container.appendChild(tabRow);
      }
    });
  }
}
