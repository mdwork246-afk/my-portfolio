export async function onRequest(context) {
    const { request, env } = context;

    // GET METHOD: Sending data to the website
    if (request.method === "GET") {
        const { results } = await env.DB.prepare(`
            SELECT p.*, 
            (SELECT json_group_array(json_object('url', m.url, 'type', m.type)) 
             FROM media m WHERE m.project_id = p.id) as mediaList
            FROM projects p
        `).all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
    }

    // POST METHOD: Taking data from the Admin and saving it
    if (request.method === "POST") {
        const formData = await request.formData();
        const title = formData.get('title');
        const desc = formData.get('desc');
        const content = formData.get('content');
        const files = formData.getAll('files');

        // Save text to D1
        const { meta } = await env.DB.prepare("INSERT INTO projects (title, desc, content) VALUES (?, ?, ?)")
            .bind(title, desc, content).run();
        const projectId = meta.last_row_id;

        // Save files to R2
        for (const file of files) {
            const fileKey = `${Date.now()}-${file.name}`;
            await env.BUCKET.put(fileKey, file.stream(), { httpMetadata: { contentType: file.type } });
            await env.DB.prepare("INSERT INTO media (project_id, url, type) VALUES (?, ?, ?)")
                .bind(projectId, fileKey, file.type).run();
        }
        return new Response("OK", { status: 200 });
    }
}
