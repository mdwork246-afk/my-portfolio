export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // GET: Fetch all projects from D1 Database
    if (request.method === "GET") {
        const { results } = await env.DB.prepare(`
            SELECT p.*, 
            (SELECT json_group_array(json_object('url', m.url, 'type', m.type)) 
             FROM media m WHERE m.project_id = p.id) as mediaList
            FROM projects p
        `).all();
        
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // POST: Save a new project and upload files to R2
    if (request.method === "POST") {
        const formData = await request.formData();
        const title = formData.get('title');
        const desc = formData.get('desc');
        const content = formData.get('content');
        const files = formData.getAll('files');

        // 1. Insert Project Text into D1
        const { meta } = await env.DB.prepare(
            "INSERT INTO projects (title, desc, content) VALUES (?, ?, ?)"
        ).bind(title, desc, content).run();

        const projectId = meta.last_row_id;

        // 2. Upload Files to R2 and Link in D1
        for (const file of files) {
            const fileKey = `${Date.now()}-${file.name}`;
            await env.BUCKET.put(fileKey, file.stream(), {
                httpMetadata: { contentType: file.type }
            });

            await env.DB.prepare(
                "INSERT INTO media (project_id, url, type) VALUES (?, ?, ?)"
            ).bind(projectId, fileKey, file.type).run();
        }

        return new Response("Project Saved", { status: 200 });
    }
}
