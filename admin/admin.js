const adminForm = document.getElementById('admin-form');

// This function sends your data to the Cloudflare Database
adminForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Uploading to Cloud...";
    submitBtn.disabled = true;

    // We use FormData because it handles real image/video files perfectly
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('desc', document.getElementById('desc').value);
    formData.append('content', document.getElementById('full-content').value);

    // Get the actual files from the input
    const fileInput = document.getElementById('file-upload');
    for (let file of fileInput.files) {
        formData.append('files', file);
    }

    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Saved Successfully to Cloudflare!");
            adminForm.reset();
        } else {
            alert("Upload failed. Check your Cloudflare D1/R2 settings.");
        }
    } catch (err) {
        console.error("Connection Error:", err);
    } finally {
        submitBtn.innerText = "Save to Portfolio";
        submitBtn.disabled = false;
    }
};
