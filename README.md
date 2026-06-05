# FrameMe

FrameMe is a simple Google Chrome extension that allows you to instantly send images from any webpage directly to your Meural Canvas frame over your local network.

## Features
- **Easy Configuration**: Simply click the extension icon and enter your Meural Canvas frame's local IP address.
- **One-Click Send**: Right-click on any image online and choose "FrameMe" from the context menu to display it instantly on your Meural.
- **Connection Validation**: Automatically pings your inserted IP address to ensure your Meural Canvas is accessible before saving.

## Supported File Types
FrameMe supports the image formats officially compatible with the Meural Canvas:
- `.jpg` / `.jpeg`
- `.png`
- `.bmp`
- `.svg`
- `.gif`
- `.heic`

## Installation

To install this extension locally (as an unpacked extension in Developer mode), follow these steps:

1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/` in your URL bar.
3. Enable **Developer mode** by toggling the switch in the top right corner.
4. Click on the **Load unpacked** button in the top left.
5. Select the `FrameMe` folder that contains the `manifest.json` file.
6. The extension is now installed and should appear in your extensions list! For easy access, click the puzzle piece icon in Chrome and "pin" the FrameMe extension to your toolbar.

## How to Use

1. **Find your Meural's IP Address**:
   - On your Meural Canvas, gesture up to reveal the menu.
   - Go to **Settings** -> **Network**.
   - Note down the IP address shown (e.g., `192.168.1.101`).
2. **Configure the Extension**:
   - Click the FrameMe icon in your Chrome toolbar.
   - Enter your Meural's IP address and click **Save Settings**. A green "Connected & Saved!" message will confirm the frame is reachable.
3. **Send an Image**:
   - Browse the web and find an image you'd like to display.
   - Right-click on the image.
   - Select **FrameMe** from the context menu.
   - You will see a notification confirming the image was sent, and it should appear on your Meural Canvas moments later!

## Troubleshooting

- **Connection failed**: Ensure your computer and your Meural Canvas are on the exact same local Wi-Fi network. Check the IP address on your frame again to make sure it hasn't changed.
- **Image doesn't send**: Some websites use complex image formats or block direct image access. Try finding a supported image format (like JPG or PNG).


---
*Made with ❤️ in Oakland*
