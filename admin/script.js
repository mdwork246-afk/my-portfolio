// Emergency Error Catcher
window.onerror = (msg) => alert("JS Error: " + msg);

const projectList = document.getElementById('project-list');

// Load projects from database
async function loadProjects() {
    try {
        const res = await fetch('/projects'); // Goes to root/functions/projects.js
        const data = await res.json();
        
        if (data.length === 0) {
            projectList.innerHTML = "No projects found.";
            return;
        }

        projectList.innerHTML = data.map(p => `
            <div class="project-item">
                <span><strong>${p.title}</strong></span>
                <button class="del-btn" onclick="deleteProject(${p.id})">Delete</button>
            </div>
        `).join('');
    } catch (err) {
        projectList.innerHTML = "Error loading projects.";
    }
}

// Save a new project
async function saveProject() {
    const btn = document.getElementById('save-project-btn');
    btn.innerText = "Saving...";
    btn.disabled = true;

    const payload = {
        title: document.getElementById('form-title').value,
        description: document.getElementById('form-desc').value,
        image_url: document.getElementById('form-img').value,
        link: document.getElementById('form-link').value
    };

    try {
        const res = await fetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            location.reload();
        } else {
            alert("Failed to save.");
        }
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Save Project";
        btn.disabled = false;
    }
}

// Delete a project
async function deleteProject(id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        const res = await fetch('/projects', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (res.ok) {
            location.reload();
        }
    } catch (err) {
        alert("Delete failed.");
    }
}

// Start the app
loadProjects();
