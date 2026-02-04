export async function onRequestGet(context) {
    // Get all projects from D1
    const { results } = await context.env.DB.prepare("SELECT * FROM projects").all();
    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
    });
}

export async function onRequestPost(context) {
    const { title, description, image_url } = await context.request.json();
    
    // Insert new project into D1
    await context.env.DB.prepare(
        "INSERT INTO projects (title, description, image_url) VALUES (?, ?, ?)"
    ).bind(title, description, image_url).run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
}
