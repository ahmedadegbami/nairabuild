import { NextResponse } from "next/server";
import crypto from "crypto";
import { getWriteClient } from "@/sanity/lib/write-client";

const MAX_BODY_LENGTH = 2000;

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

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = request.headers.get("user-agent") || "";
  const ipHash = ip
    ? crypto.createHash("sha256").update(ip).digest("hex")
    : null;

  const doc: Record<string, any> = {
    _type: "comment",
    name,
    email: email || undefined,
    body,
    post: { _type: "reference", _ref: postId },
    status: "approved",
    createdAt: new Date().toISOString(),
    ipHash: ipHash || undefined,
    userAgent: userAgent || undefined,
  };

  if (parentId) {
    doc.parent = { _type: "reference", _ref: parentId };
  }

  const created = await writeClient.create(doc as { _type: string });

  return NextResponse.json({
    ok: true,
    comment: {
      _id: created._id,
      name,
      body,
      createdAt: doc.createdAt,
      parentId: parentId || null,
    },
  });
}
