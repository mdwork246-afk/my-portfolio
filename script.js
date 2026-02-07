function render() {
    const data = JSON.parse(localStorage.getItem('portfolioData')) || { skills: [], projects: [] };
    
    // Skills
    document.getElementById('skills-grid').innerHTML = data.skills.map(s => `
        <div class="card"><h3>${s.title}</h3><p>${s.desc}</p></div>
    `).join('');

    // Projects
    document.getElementById('project-grid').innerHTML = data.projects.map(p => {
        // Limit to 2 pictures for the preview
        const previewMedia = (p.mediaList || []).slice(0, 2);
        
        let mediaHtml = previewMedia.map(item => {
            if (item.type === 'video') return `<video src="${item.data}" style="height:100px; width:48%; object-fit:cover;"></video>`;
            return `<img src="${item.data}" style="height:100px; width:48%; object-fit:cover; margin:1%;">`;
        }).join('');

        return `
            <a href="project-detail.html?id=${p.id}">
                <div class="card">
                    <h2>${p.title}</h2>
                    <div style="display:flex; flex-wrap:wrap; justify-content:center; background:#000; border-radius:8px; margin-bottom:10px;">
                        ${mediaHtml || '<img src="https://via.placeholder.com/300" style="width:100%">'}
                    </div>
                    <p>${p.desc}</p>
                    <small style="color:var(--accent)">View full gallery (${p.mediaList?.length || 0} items)</small>
                </div>
            </a>
        `;
    }).join('');
}
render();
