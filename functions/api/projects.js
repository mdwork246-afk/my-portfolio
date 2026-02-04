
export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;
  const method = request.method;

  if (method === "GET") {
    const { results } = await DB.prepare("SELECT * FROM projects").all();
    return Response.json(results);
  }

  if (method === "POST") {
    const { title, description, image_url, link } = await request.json();
    await DB.prepare("INSERT INTO projects (title, description, image_url, link) VALUES (?, ?, ?, ?)")
      .bind(title, description, image_url, link)
      .run();
    return new Response("Added", { status: 201 });
  }

  if (method === "DELETE") {
    const { id } = await request.json();
    await DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
    return new Response("Deleted", { status: 200 });
  }

  return new Response("Method not allowed", { status: 405 });
}
