export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM projects").all();
        return new Response(JSON.stringify(results));
    }

    if (request.method === "POST") {
        const data = await request.formData();
        await env.DB.prepare("INSERT INTO projects (title, desc) VALUES (?, ?)")
            .bind(data.get('title'), data.get('desc')).run();
        return new Response("Saved");
    }
}
