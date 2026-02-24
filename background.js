const MEURAL_IP = "192.168.107.222";

// Helper for clean UI feedback
function showStatus(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon128.png",
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "sendToMeural") {
    const imageUrl = info.srcUrl;
    console.log("Attempting to send:", imageUrl);

    try {
      // 1. Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Could not fetch source image");
      const blob = await response.blob();

      // 2. Prepare for Meural
      // Some Meural firmware versions prefer 'image' and some prefer 'file'
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg'); 

      // 3. POST to Meural
      const uploadResponse = await fetch(`http://${MEURAL_IP}/remote/control_command/upload_and_display`, {
        method: 'POST',
        body: formData,
        // CRITICAL: Do NOT set Content-Type header manually; 
        // the browser needs to set the boundary for multipart/form-data itself.
      });

      if (uploadResponse.ok) {
        showStatus("Success!", "Artwork sent to your Meural.");
      } else {
        const statusText = await uploadResponse.text();
        console.error("Meural Error:", statusText);
        showStatus("Meural Rejected", `Status: ${uploadResponse.status}`);
      }
    } catch (error) {
      showStatus("Connection Error", "Is the Meural IP correct and awake?");
      console.error("Full Error:", error);
    }
  }
});