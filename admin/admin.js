const adminForm = document.getElementById('admin-form');
const adminList = document.getElementById('admin-list');
const orderPreview = document.getElementById('media-order-preview');
let editId = null; 

// 1. Load the list of items
function loadAdmin() {
    const data = JSON.parse(localStorage.getItem('portfolioData')) || { skills: [], projects: [] };
    adminList.innerHTML = '';

    const all = [
        ...data.skills.map(s => ({...s, cat: 'skills'})),
        ...data.projects.map(p => ({...p, cat: 'projects'}))
    ];

    adminList.innerHTML = all.map(item => `
        <div style="background:#0f172a; padding:10px; margin-bottom:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>[${item.cat.toUpperCase()}] ${item.title}</span>
            <div>
                <button onclick="prepareEdit(${item.id}, '${item.cat}')" style="background:var(--accent); font-size:12px;">Edit</button>
                <button onclick="deleteItem(${item.id}, '${item.cat}')" style="background:#ef4444; font-size:12px;">Del</button>
            </div>
        </div>
    `).join('');
}

// 2. Prepare Form for Editing
window.prepareEdit = (id, cat) => {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const item = data[cat].find(i => i.id === id);
    
    editId = id;
    document.getElementById('type').value = (cat === 'skills') ? 'skill' : 'project';
    document.getElementById('title').value = item.title;
    document.getElementById('desc').value = item.desc;
    document.getElementById('full-content').value = item.content;
    
    document.getElementById('form-title').innerText = "Editing: " + item.title;
    document.getElementById('submit-btn').innerText = "Update Entry";
    document.getElementById('cancel-btn').style.display = "inline-block";

    if (cat === 'projects' && item.mediaList) {
        renderMediaOrder(item.mediaList);
    } else {
        orderPreview.innerHTML = '';
    }
    window.scrollTo(0,0);
};

// 3. Render Reorder Buttons
function renderMediaOrder(list) {
    orderPreview.innerHTML = '<h4>Reorder Media (Top 2 show on Home)</h4>';
    list.forEach((m, i) => {
        orderPreview.innerHTML += `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:5px; background:#334155; padding:5px; border-radius:5px;">
                <img src="${m.data}" style="width:40px; height:40px; object-fit:cover;">
                <button type="button" onclick="moveMedia(${i}, -1)">↑</button>
                <button type="button" onclick="moveMedia(${i}, 1)">↓</button>
                <span style="font-size:10px;">${i === 0 || i === 1 ? '⭐ Main Page' : ''}</span>
            </div>
        `;
    });
}

// 4. Move Media Up/Down
window.moveMedia = (index, direction) => {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    const p = data.projects.find(i => i.id === editId);
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < p.mediaList.length) {
        const temp = p.mediaList[index];
        p.mediaList[index] = p.mediaList[newIndex];
        p.mediaList[newIndex] = temp;
        localStorage.setItem('portfolioData', JSON.stringify(data));
        renderMediaOrder(p.mediaList);
    }
};

// 5. Submit Form (Save or Update)
adminForm.onsubmit = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload');
    let data = JSON.parse(localStorage.getItem('portfolioData')) || { skills: [], projects: [] };
    
    let newMedia = [];
    if (fileInput.files.length > 0) {
        for (let file of fileInput.files) {
            const b64 = await new Promise(r => {
                const reader = new FileReader();
                reader.onload = () => r(reader.result);
                reader.readAsDataURL(file);
            });
            newMedia.push({ data: b64, type: file.type.startsWith('video') ? 'video' : 'image' });
        }
    }

    const type = document.getElementById('type').value;
    const cat = (type === 'skill') ? 'skills' : 'projects';

    if (editId) {
        const idx = data[cat].findIndex(i => i.id === editId);
        data[cat][idx].title = document.getElementById('title').value;
        data[cat][idx].desc = document.getElementById('desc').value;
        data[cat][idx].content = document.getElementById('full-content').value;
        if (newMedia.length > 0) data[cat][idx].mediaList = newMedia;
    } else {
        data[cat].push({
            id: Date.now(),
            title: document.getElementById('title').value,
            desc: document.getElementById('desc').value,
            content: document.getElementById('full-content').value,
            mediaList: newMedia
        });
    }

    localStorage.setItem('portfolioData', JSON.stringify(data));
    resetAdminForm();
    loadAdmin();
};

function resetAdminForm() {
    editId = null;
    adminForm.reset();
    orderPreview.innerHTML = '';
    document.getElementById('form-title').innerText = "Add New Content";
    document.getElementById('submit-btn').innerText = "Save to Portfolio";
    document.getElementById('cancel-btn').style.display = "none";
}

window.deleteItem = (id, cat) => {
    const data = JSON.parse(localStorage.getItem('portfolioData'));
    data[cat] = data[cat].filter(i => i.id !== id);
    localStorage.setItem('portfolioData', JSON.stringify(data));
    loadAdmin();
};

loadAdmin();
