document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ip-input');
    const saveBtn = document.getElementById('save-btn');
    const statusMsg = document.getElementById('status-message');

    // Load existing IP if any, otherwise set a common default placeholder
    chrome.storage.sync.get('meuralIp', (data) => {
        if (data.meuralIp) {
            ipInput.value = data.meuralIp;
        }
    });

    saveBtn.addEventListener('click', async () => {
        const ip = ipInput.value.trim();
        if (!ip) return;

        // UI Feedback for testing phase
        saveBtn.disabled = true;
        saveBtn.textContent = 'Validating...';
        statusMsg.style.color = '#a0a0a0';
        statusMsg.textContent = 'Contacting frame...';

        try {
            // Ping the entered IP with a generic request and short timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

            // We attempt to hit the frame's server. Since we have <all_urls> permission, this works even against CORS for extensions.
            await fetch(`http://${ip}/`, {
                method: 'GET',
                signal: controller.signal,
                mode: 'no-cors' // Use no-cors to prevent browser from blocking obscure responses; we just care about reachability
            });

            clearTimeout(timeoutId);

            // Save if successful
            chrome.storage.sync.set({ meuralIp: ip }, () => {
                statusMsg.style.color = '#4caf50'; // Green for success
                statusMsg.textContent = 'Connected & Saved!';
                setTimeout(() => {
                    statusMsg.textContent = '';
                }, 3000);
            });
        } catch (error) {
            // If network fails or times out
            statusMsg.style.color = '#f44336'; // Red for error
            statusMsg.textContent = 'Connection failed. Check IP.';
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Settings';
        }
    });
});
