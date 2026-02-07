async function loadHome() {
    const grid = document.getElementById('project-grid');
    
    // This tells the browser: "Go to the internet and get my projects"
    const response = await fetch('/api/projects');
    const projects = await response.json(); 

    // This puts the projects onto your screen
    grid.innerHTML = projects.map(p => {
        const media = JSON.parse(p.mediaList || "[]");
        const preview = media.slice(0, 2); 

        const mediaHtml = preview.map(m => {
            const fileUrl = `/api/media?key=${m.url}`;
            return m.type.includes('video') 
                ? `<video src="${fileUrl}" style="width:48%; height:100px; object-fit:cover;"></video>`
                : `<img src="${fileUrl}" style="width:48%; height:100px; object-fit:cover;">`;
        }).join('');

        return `
            <div class="card">
                <div style="display:flex; gap:5px;">${mediaHtml}</div>
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
            </div>
        `;
    }).join('');
}

loadHome();
