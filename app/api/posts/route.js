import { NextResponse } from "next/server";
import { listPosts, createPost } from "../../../lib/db";

const VALID_CATEGORIES = ["scholarship", "job", "update", "news"];

export async function GET() {
  try {
    const posts = await listPosts();
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load postings." }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { category, title, organization, description, content, link, location, deadline } = body;

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "A valid category is required." }, { status: 400 });
  }
  if (!title || !title.trim()) {
    return NextResponse.json({ error: "A title is required." }, { status: 400 });
  }
  if (!description || !description.trim()) {
    return NextResponse.json({ error: "A description is required." }, { status: 400 });
  }

  try {
    const post = await createPost({
      category,
      title: title.trim(),
      organization: organization?.trim() || null,
      description: description.trim(),
      content: content?.trim() || null,
      link: link?.trim() || null,
      location: location?.trim() || null,
      deadline: deadline ? new Date(deadline) : null,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save this posting." }, { status: 500 });
  }
}
