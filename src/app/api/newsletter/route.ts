import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const toEmail = process.env.SUBMISSION_TO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      return NextResponse.json(
        {
          message:
            "Email delivery is not configured yet. Add RESEND_FROM_EMAIL and SUBMISSION_TO_EMAIL to enable subscriptions.",
        },
        { status: 500 },
      );
    }

    const resend = getResend();

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Lebanese Academic newsletter signup / ${email}`,
      text: [`Newsletter signup: ${email}`, "", "Source: homepage"].join("\n"),
    });

    return NextResponse.json({
      message: "You are on the dispatch list.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while subscribing.",
      },
      { status: 500 },
    );
  }
}
