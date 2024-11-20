let INACTIVITY_TIME = 1 * 60 * 1000; // Default: 1 minute
let tabsActivity = {};
let intervalId = null;

// Load inactivity time from storage
chrome.storage.sync.get(['inactivityTime'], (result) => {
  if (result.inactivityTime) {
    INACTIVITY_TIME = result.inactivityTime;
    console.log(`Loaded inactivity time: ${INACTIVITY_TIME} ms`);
  }
  startCheckingInactivity();
});

// Update tab activity when activated
chrome.tabs.onActivated.addListener(({ tabId }) => {
  console.log(`Tab activated: ${tabId}`);
  tabsActivity[tabId] = Date.now();
});

// Update tab activity when updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    console.log(`Tab updated: ${tabId}`);
    tabsActivity[tabId] = Date.now();
  }
});

// Listen for changes in inactivity time and update the interval
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.inactivityTime) {
    INACTIVITY_TIME = changes.inactivityTime.newValue;
    console.log(`Inactivity time updated to: ${INACTIVITY_TIME} ms`);
    restartCheckingInactivity();
  }
});

// Function to start checking for inactive tabs
function startCheckingInactivity() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    console.log('Checking for inactive tabs...');
    const now = Date.now();

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (
          !tab.active && // Tab is not active
          tabsActivity[tab.id] && // There is a recorded timestamp
          now - tabsActivity[tab.id] > INACTIVITY_TIME && // Exceeds inactivity threshold
          !tab.pinned && // Not a pinned tab
          tab.groupId === -1 && // Not part of a group
          !tab.audible // Not playing audio
        ) {
          console.log(`Closing tab ${tab.id}: inactive for ${now - tabsActivity[tab.id]} ms`);
          chrome.tabs.remove(tab.id);
        } else {
          console.log(`Skipping tab ${tab.id}: does not meet criteria for closing`);
        }
      });
    });
  }, 1 * 1000); // Run every 10 seconds
}

// Function to restart the interval when settings change
function restartCheckingInactivity() {
  clearInterval(intervalId);
  startCheckingInactivity();
}

// Send tab activity info and INACTIVITY_TIME to popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    // Send both tabs activity and inactivity time
    port.postMessage({ tabsActivity, INACTIVITY_TIME });
  }
});
