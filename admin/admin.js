const adminForm = document.getElementById('admin-form');

adminForm.onsubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('desc', document.getElementById('desc').value);
    formData.append('content', document.getElementById('full-content').value);

    // Get the files you selected
    const files = document.getElementById('file-upload').files;
    for (let file of files) {
        formData.append('files', file);
    }

    // Send the package to the Cloudflare Worker
    await fetch('/api/projects', {
        method: 'POST',
        body: formData
    });

    alert("Project saved to the Cloud!");
    adminForm.reset();
};
