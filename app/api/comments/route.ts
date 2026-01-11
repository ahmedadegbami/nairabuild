import { NextResponse } from "next/server";
import crypto from "crypto";
import { getWriteClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { createClient } from "@supabase/supabase-js";

const MAX_BODY_LENGTH = 2000;
const MAX_LINKS = 1;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map<string, number>();

const countLinks = (text: string) =>
  (text.match(/https?:\/\/\S+|www\.\S+/gi) || []).length;

const isRateLimited = (key: string) => {
  const now = Date.now();
  const last = rateLimitBuckets.get(key) ?? 0;
  if (now - last < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  rateLimitBuckets.set(key, now);
  return false;
};

export async function POST(request: Request) {
  const writeClient = getWriteClient();

  if (!writeClient) {
    return NextResponse.json(
      { error: "Comments are not configured." },
      { status: 503 }
    );
  }

  const payload = await request.json();
  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim();
  const body = String(payload?.body || "").trim();
  const postId = String(payload?.postId || "").trim();
  const parentId = String(payload?.parentId || "").trim();
  const website = String(payload?.website || "").trim();

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !body || !postId) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  if (body.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Comment is too long." }, { status: 400 });
  }
  if (countLinks(body) > MAX_LINKS) {
    return NextResponse.json(
      { error: "Too many links in comment." },
      { status: 400 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = request.headers.get("user-agent") || "";
  const ipHash = ip
    ? crypto.createHash("sha256").update(ip).digest("hex")
    : null;

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: userData } = await supabase.auth.getUser(token);
  const userEmail = userData.user?.email?.toLowerCase() ?? null;
  const userId = userData.user?.id ?? null;
  if (!userEmail) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (isRateLimited(`email:${userEmail}`)) {
    return NextResponse.json(
      { error: "Please wait before posting again." },
      { status: 429 }
    );
  }
  if (ipHash && isRateLimited(`ip:${ipHash}`)) {
    return NextResponse.json(
      { error: "Please wait before posting again." },
      { status: 429 }
    );
  }

  let verifiedAuthor:
    | { _id: string; name?: string; authorEmail?: string }
    | null = null;
  const authorData = await client.fetch(
    `*[_type == "post" && _id == $postId][0]{ author->{ _id, name, authorEmail } }`,
    { postId }
  );
  const author = authorData?.author as
    | { _id: string; name?: string; authorEmail?: string }
    | undefined;
  if (author?.authorEmail?.toLowerCase() === userEmail) {
    verifiedAuthor = author;
  }

  const doc: Record<string, any> = {
    _type: "comment",
    name: verifiedAuthor?.name || name,
    email: verifiedAuthor?.authorEmail || userEmail || undefined,
    body,
    post: { _type: "reference", _ref: postId },
    status: "approved",
    createdAt: new Date().toISOString(),
    userId: userId || undefined,
    ipHash: ipHash || undefined,
    userAgent: userAgent || undefined,
  };

  if (parentId) {
    doc.parent = { _type: "reference", _ref: parentId };
  }
  if (verifiedAuthor) {
    doc.isStaff = true;
    doc.staffAuthor = { _type: "reference", _ref: verifiedAuthor._id };
  }

  const created = await writeClient.create(doc as { _type: string });

  return NextResponse.json({
    ok: true,
    comment: {
      _id: created._id,
      name: doc.name,
      body,
      createdAt: doc.createdAt,
      parentId: parentId || null,
      isStaff: doc.isStaff || false,
      userId: userId || null,
      editedAt: null,
      deletedAt: null,
      staffAuthor: verifiedAuthor
        ? { _id: verifiedAuthor._id, name: verifiedAuthor.name }
        : null,
    },
  });
}
