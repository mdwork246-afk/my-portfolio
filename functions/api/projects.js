export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;
  const method = request.method;

  try {
    if (method === "GET") {
      const { results } = await DB.prepare("SELECT * FROM projects").all();
      return Response.json(results);
    }

    if (method === "POST") {
      const { title, description, image_url, link } = await request.json();
      await DB.prepare("INSERT INTO projects (title, description, image_url, link) VALUES (?, ?, ?, ?)")
        .bind(title, description, image_url, link)
        .run();
      return new Response("Project Added", { status: 201 });
    }

    if (method === "DELETE") {
      const { id } = await request.json();
      await DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
      return new Response("Project Deleted", { status: 200 });
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }

  return new Response("Method not allowed", { status: 405 });
}
