async function loadPortfolio() {
    const grid = document.getElementById('project-grid');
    
    try {
        // 1. Fetch the data from your Cloudflare API
        const response = await fetch('/api/projects');
        const projects = await response.json();

        // 2. Clear the grid and render the new data
        grid.innerHTML = projects.map(p => {
            // Parse the media list that comes back from the database
            const media = JSON.parse(p.mediaList || "[]");
            const preview = media.slice(0, 2); 

            const mediaHtml = preview.map(m => {
                // This route pulls the image directly from your R2 Bucket
                const fileUrl = `/api/media?key=${m.url}`;
                return m.type.includes('video') 
                    ? `<video src="${fileUrl}" class="preview-media"></video>`
                    : `<img src="${fileUrl}" class="preview-media">`;
            }).join('');

            return `
                <a href="project-detail.html?id=${p.id}" class="card-link">
                    <div class="card">
                        <div class="media-preview-container">${mediaHtml}</div>
                        <h3>${p.title}</h3>
                        <p>${p.desc}</p>
                    </div>
                </a>
            `;
        }).join('');

    } catch (err) {
        grid.innerHTML = "<p>Error loading projects. Please try again later.</p>";
        console.error("Fetch Error:", err);
    }
}

loadPortfolio();
