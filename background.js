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
    const cropperUrl = chrome.runtime.getURL('cropper.html') + `?src=${encodeURIComponent(info.srcUrl)}`;
    chrome.tabs.create({ url: cropperUrl });
  }
});