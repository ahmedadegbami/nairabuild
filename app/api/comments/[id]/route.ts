import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWriteClient } from "@/sanity/lib/write-client";

const MAX_BODY_LENGTH = 2000;

const getUser = async (request: Request) => {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return { user: null };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: null };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase.auth.getUser(token);
  return { user: data.user ?? null };
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const writeClient = getWriteClient();
  if (!writeClient) {
    return NextResponse.json(
      { error: "Comments are not configured." },
      { status: 503 }
    );
  }

  const { user } = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const payload = await request.json();
  const body = String(payload?.body || "").trim();
  if (!body) {
    return NextResponse.json({ error: "Comment is required." }, { status: 400 });
  }
  if (body.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Comment is too long." }, { status: 400 });
  }

  const doc = await writeClient.getDocument(id);
  if (!doc || doc._type !== "comment") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const emailMatch =
    !doc.userId &&
    doc.email &&
    user.email &&
    String(doc.email).toLowerCase() === String(user.email).toLowerCase();
  if (doc.userId !== user.id && !emailMatch) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await writeClient
    .patch(id)
    .set({
      body,
      editedAt: new Date().toISOString(),
      userId: doc.userId || user.id,
      email: doc.email || user.email,
    })
    .commit();

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const writeClient = getWriteClient();
  if (!writeClient) {
    return NextResponse.json(
      { error: "Comments are not configured." },
      { status: 503 }
    );
  }

  const { user } = await getUser(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const doc = await writeClient.getDocument(id);
  if (!doc || doc._type !== "comment") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const emailMatch =
    !doc.userId &&
    doc.email &&
    user.email &&
    String(doc.email).toLowerCase() === String(user.email).toLowerCase();
  if (doc.userId !== user.id && !emailMatch) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await writeClient
    .patch(id)
    .set({
      body: "",
      deletedAt: new Date().toISOString(),
      userId: doc.userId || user.id,
      email: doc.email || user.email,
    })
    .commit();

  return NextResponse.json({ ok: true });
}
