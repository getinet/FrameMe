const MEURAL_IP = "192.168.107.222"; // Ensure this is your current IP

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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToMeural",
    title: "Send to Meural Canvas",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "sendToMeural") {
    try {
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('photo', blob, 'image.jpg');

      const uploadUrl = `http://${MEURAL_IP}/remote/postcard/`;

      await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
      });

      // Notify the user of success
      notify("Meural Canvas", "Image sent to your frame successfully.");
      
    } catch (error) {
      notify("Meural Error", "Could not reach the Canvas. Check your IP.");
    }
  }
});