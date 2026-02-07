export async function onRequestGet(context) {
    const { env } = context;
    // Get all projects and their media
    const { results } = await env.DB.prepare(`
        SELECT p.*, GROUP_CONCAT(m.url) as media_urls, GROUP_CONCAT(m.type) as media_types
        FROM projects p
        LEFT JOIN media m ON p.id = m.project_id
        GROUP BY p.id
    `).all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const formData = await request.formData();
    
    const title = formData.get('title');
    const desc = formData.get('desc');
    const content = formData.get('content');
    const files = formData.getAll('files');

    // 1. Insert Project
    const { meta } = await env.DB.prepare(
        "INSERT INTO projects (title, desc, content) VALUES (?, ?, ?)"
    ).bind(title, desc, content).run();
    const projectId = meta.last_row_id;

    // 2. Upload Files to R2 and Link in D1
    for (const file of files) {
        const fileKey = `${Date.now()}-${file.name}`;
        await env.BUCKET.put(fileKey, file.stream()); 
        await env.DB.prepare(
            "INSERT INTO media (project_id, url, type) VALUES (?, ?, ?)"
        ).bind(projectId, fileKey, file.type).run();
    }

    return new Response("Project Saved", { status: 200 });
}
