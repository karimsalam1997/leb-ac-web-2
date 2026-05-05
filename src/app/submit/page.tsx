import Image from "next/image";
import { BookOpen, Camera, Clock, Feather, Shield } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SubmitForm } from "@/components/submit-form";

const guidelines = [
  {
    Icon: BookOpen,
    title: "Write from your experience.",
    text: "Personal, honest accounts matter most.",
  },
  {
    Icon: Feather,
    title: "No manifestos. No hate.",
    text: "We welcome difference. We do not publish harm.",
  },
  {
    Icon: Shield,
    title: "Protect people's dignity.",
    text: "Change names and details if needed.",
  },
  {
    Icon: Camera,
    title: "Images are welcome.",
    text: "Photos, scans, letters, or small fragments of life.",
  },
  {
    Icon: Clock,
    title: "Keep it your own.",
    text: "Unpublished work only, in your own words.",
  },
];

export default function SubmitPage() {
  return (
    <SiteShell activePath="/submit">
      <section className="paper-frame pt-5">
        <div className="submit-layout editorial-rule">
          <aside className="submit-guidance">
            <div>
              <h1 className="display-title text-[4.25rem] leading-none text-[var(--accent)]">
                Submit a Letter
              </h1>
              <p className="mt-4 text-[1.35rem] leading-7">
                Send a letter from wherever Lebanon has followed you.
              </p>
              <p className="arabic mt-4 text-right text-[1.8rem] leading-[1.35] text-[var(--accent)]">
                أرسل رسالة من حيثما تبعك لبنان.
              </p>
            </div>

            <div className="mt-8 border-t border-[color:var(--line)] pt-7">
              <div className="editorial-kicker mb-6">Before You Write</div>
              <div className="space-y-5">
                {guidelines.map((item) => (
                  <div key={item.title} className="submit-guideline">
                    <item.Icon size={34} strokeWidth={1.25} />
                    <div>
                      <h2>{item.title}</h2>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="submit-quote">
              <div className="text-[4.5rem] leading-none text-[var(--accent)]">“</div>
              <p>A letter is a small boat.</p>
              <p>It carries one voice across water so others may know they are not alone.</p>
              <p className="arabic mt-4 text-right text-[1.25rem] leading-7 text-[var(--accent)]">
                تحمل صوتاً واحداً عبر الماء ليعرف غيره أنه ليس وحده.
              </p>
            </blockquote>
          </aside>

          <div>
            <SubmitForm />
            <div className="submit-reassurance">
              <div className="text-[2rem] text-[var(--accent)]">♡</div>
              <div>
                <p className="font-medium">You do not need to write perfectly.</p>
                <p>Send the letter as you would say it. We may lightly edit with care.</p>
              </div>
              <Image
                src="/brand/la-editors-mark.png"
                alt=""
                width={52}
                height={52}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
