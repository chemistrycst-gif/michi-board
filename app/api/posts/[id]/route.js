import { NextResponse } from "next/server";
import { updatePost, deletePost } from "../../../../lib/db";

const VALID_CATEGORIES = ["scholarship", "job", "news", "update"];

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const { category, title, organization, description, link, location, deadline } = body;

  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  try {
    const post = await updatePost(id, {
      category,
      title: title?.trim(),
      organization: organization?.trim() || null,
      description: description?.trim(),
      link: link?.trim() || null,
      location: location?.trim() || null,
      deadline: deadline ? new Date(deadline) : null,
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update this posting." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const ok = await deletePost(id);
    if (!ok) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete this posting." }, { status: 500 });
  }
}
