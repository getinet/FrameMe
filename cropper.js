document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imgSrc = urlParams.get('src');
    const imageElement = document.getElementById('image-to-crop');
    const sendBtn = document.getElementById('send-btn');

    if (!imgSrc) {
        console.error("No image source provided.");
        return;
    }

    let cropper;

    // Fetch the image as a blob to bypass CORS/Tainted Canvas restrictions
    try {
        sendBtn.disabled = true;
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        imageElement.src = objectURL;
    } catch (error) {
        console.error("Failed to fetch image:", error);
        alert("Could not load image. The website may be blocking access.");
        return;
    }

    imageElement.onload = () => {
        try {
            cropper = new Cropper(imageElement, {
                aspectRatio: 9 / 16,
                viewMode: 1, // Restrict crop box to not exceed the size of the canvas
                autoCropArea: 1,
                responsive: true,
                ready() {
                    sendBtn.disabled = false;
                }
            });
        } catch (e) {
            console.error("Cropper initialization failed:", e);
        }
    };

    // Toolbar Controls
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.zoom(0.1);
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.zoom(-0.1);
    });

    document.getElementById('move-mode-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.setDragMode('move');
    });

    document.getElementById('crop-mode-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.setDragMode('crop');
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.reset();
    });

    sendBtn.addEventListener('click', async () => {
        if (!cropper) return;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        try {
            const data = await chrome.storage.sync.get('meuralIp');
            const ip = data.meuralIp;

            if (!ip) {
                alert('Meural IP not configured. Please check extension settings.');
                return;
            }

            // Get the cropped canvas
            const canvas = cropper.getCroppedCanvas({
                maxWidth: 4096, // Meural handles high res well
                maxHeight: 4096
            });

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('photo', blob, 'cropped_image.jpg');

                const uploadUrl = `http://${ip}/remote/postcard/`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000);

                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    alert('Successfully sent to Meural!');
                    window.close();
                } else {
                    throw new Error('Upload failed');
                }
            }, 'image/jpeg', 0.9);

        } catch (error) {
            alert('Error connecting to Meural. Check your IP and network.');
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send to Meural';
        }
    });
});