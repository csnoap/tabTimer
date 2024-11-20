# Tab Timer Chrome Extension

This Chrome extension helps manage your open tabs by automatically closing inactive tabs after a user-defined period of inactivity. The extension allows you to specify the inactivity time (in minutes) and also excludes pinned tabs, tabs in groups, and tabs playing audio from being closed. It offers a real-time countdown for remaining time for non-locked tabs and displays "Locked" for tabs that are protected.

## Features

- **Automatic Tab Closing**: Closes inactive tabs after a specified inactivity period.
- **Customizable Inactivity Time**: Set your desired inactivity time (in minutes) for when tabs should automatically close.
- **Exclusions for Protected Tabs**: Pinned tabs, tabs in groups, and tabs playing audio are excluded from being closed and are marked as "Locked".
- **Real-Time Countdown**: Displays a real-time countdown for non-locked tabs with seconds remaining before they are closed.
- **URL Shortening**: Tab URLs are truncated to 30 characters for easier viewing.

## Installation

1. Download the extension files to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click on **Load unpacked** and select the folder containing the extension files.
5. The extension will be installed and active. You should see the extension's icon in the browser toolbar.

## Usage

- **Setting Inactivity Time**: 
  - Click on the extension icon in the Chrome toolbar to open the settings popup.
  - Enter your desired inactivity time in minutes and click "Save Settings".
  
- **Tab Protection**: 
  - Pinned tabs, tabs in groups, and tabs that are playing audio will be marked as "Locked" and will not be closed, even if they are inactive.

- **Viewing Tab Information**:
  - The extension's popup will display the list of open tabs with their remaining time (in seconds) until they are automatically closed.
  - Locked tabs will show "Locked" instead of a countdown.

## How It Works

1. **Detect Inactivity**: The extension tracks the last activity time for each tab (when it's activated or updated).
2. **Check for Inactivity**: Every 10 seconds, the extension checks if any tabs have been inactive for longer than the set inactivity period.
3. **Close Inactive Tabs**: Tabs that exceed the inactivity period and are not locked (i.e., pinned, part of a group, or playing audio) will be closed automatically.
4. **Real-Time Countdown**: The remaining time for each non-locked tab is displayed and updated every second in the popup.

## Excluded Tabs

The following tabs will not be closed, even if they exceed the inactivity threshold:

- **Pinned Tabs**: Tabs that are pinned in the browser.
- **Tabs in Groups**: Tabs that are part of a group.
- **Tabs Playing Audio**: Tabs that are playing audio (e.g., media players, YouTube).

These tabs will display "Locked" in the popup instead of a countdown timer.

## Files Overview

- **background.js**: Handles the background logic for tracking tab inactivity, checking tab states, and closing inactive tabs.
- **popup.js**: Manages the popup UI, displaying tab information, real-time countdown, and providing a UI for saving the inactivity time.
- **manifest.json**: Defines the extension settings, permissions, and configuration.
- **icons/**: Contains the icons for the extension.

## Permissions

This extension requires the following permissions:

- `tabs`: To access and manage tab information.
- `storage`: To save and retrieve the inactivity time settings.
- `activeTab`: To monitor tab activity.

## Troubleshooting

- If the countdown is not updating, ensure that the extension has permission to access and manage tabs.
- If the settings don't save, ensure that your browser allows extensions to access Chrome's storage.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request with your improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Pro Tips

A tab will not be recorded if it is not clicked. For example, if you have existing tabs and then start the extension, you'll have to click on the existing tabs. New tabs should be recorded
