import { Resend } from "resend";

export const POST = async (request: Request) => {
  const { email } = await request.json();
  const resendApiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey || !audienceId) {
    return Response.json(
      { error: "Newsletter is not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Error subscribing to updates" },
      { status: 400 }
    );
  }
};
