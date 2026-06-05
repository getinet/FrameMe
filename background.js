// Helper for clean notifications
function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png", // Ensure you have an icon file in your folder
    title: title,
    message: message,
    priority: 2
  });
}

async function getMeuralIp() {
  const data = await chrome.storage.sync.get('meuralIp');
  return data.meuralIp || null;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToMeural",
    title: "FrameMe",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "sendToMeural") {
    try {
      const MEURAL_IP = await getMeuralIp();
      if (!MEURAL_IP) {
        notify("Configuration Required", "Please set your Meural IP in the extension settings.");
        return;
      }

      const response = await fetch(info.srcUrl);
      if (!response.ok) {
        throw new Error("Could not fetch source image.");
      }
      
      const blob = await response.blob();

      // Try to determine extension from URL or mime-type
      const extension = blob.type.split('/')[1] || 'jpg';
      const fileName = `image.${extension}`;

      const formData = new FormData();
      formData.append('photo', blob, fileName);

      const uploadUrl = `http://${MEURAL_IP}/remote/postcard/`;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      // Notify the user of success
      notify("Meural Canvas", "Image sent to your frame successfully.");

    } catch (error) {
      notify("Meural Error", "Could not reach the Canvas. Check your IP.");
    }
  }
});