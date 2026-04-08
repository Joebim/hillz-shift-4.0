import Link from "next/link";
import Image from "next/image";
import { queryDocuments, countDocuments } from "@/src/lib/firebase/firestore";
import { toJsDate } from "@/src/lib/utils";
import { Event } from "@/src/types/event";
import { Sermon } from "@/src/types/sermon";
import { Ministry } from "@/src/types/ministry";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Hero } from "@/src/components/home/Hero";
import { Newsletter } from "@/src/components/home/Newsletter";
import { Section } from "@/src/components/shared/Section";
import { EventCard } from "@/src/components/events/EventCard";
import { SermonCard } from "@/src/components/sermons/SermonCard";
import { MinistryCard } from "@/src/components/ministries/MinistryCard";
import { Button } from "@/src/components/ui/Button";
import {
  ArrowRight,
  Quote,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  Calendar,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Hillz | Experience New Dimensions",
  description:
    "Welcome to The Hillz platform. Join us for transformative gatherings and spiritual experiences.",
};

export default async function HomePage() {
  const [
    rawEvents,
    rawSermons,
    rawMinistries,
    membershipEvent,
    totalEventsCount,
  ] = await Promise.all([
    queryDocuments<Event>(
      "events",
      { status: "published", featured: true },
      "startDate",
      3,
    ),
    queryDocuments<Sermon>("sermons", {}, "date", 3),
    queryDocuments<Ministry>("ministries", { active: true }, "order", 4),
    queryDocuments<Event>("events", { isMembershipForm: true }, "createdAt", 1),
    countDocuments("events", { status: "published" }),
  ]);

  const processEvent = (event: Event) => ({
    ...event,
    startDate: toJsDate(event.startDate),
    endDate: toJsDate(event.endDate),
    registrationOpenDate: toJsDate(event.registrationOpenDate),
    registrationCloseDate: toJsDate(event.registrationCloseDate),
    createdAt: toJsDate(event.createdAt),
    updatedAt: toJsDate(event.updatedAt),
  });

  const featuredEvents = rawEvents.map(processEvent);

  const latestSermons = rawSermons.map((sermon) => ({
    ...sermon,
    date: toJsDate(sermon.date),
    createdAt: toJsDate(sermon.createdAt),
    updatedAt: toJsDate(sermon.updatedAt),
  }));

  const ministries = rawMinistries.map((ministry) => ({
    ...ministry,
    createdAt: toJsDate(ministry.createdAt),
    updatedAt: toJsDate(ministry.updatedAt),
  }));

  const rawHeroEvent = membershipEvent?.[0] || rawEvents[0];
  const processedHeroEvent = rawHeroEvent ? processEvent(rawHeroEvent) : null;

  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-purple-900 font-medium">
      <Header />

      <Hero upcomingEvent={processedHeroEvent as Event} />

      {}
      <Section bg="none" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-widest mb-6">
              <Clock className="w-3.5 h-3.5" />
              Weekly Gatherings
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
              Join Our Sessions
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              To experience the unsearchable riches of Christ and the effectual
              working of His power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {}
            <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 mb-8">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">
                10:15 PM
              </h3>
              <p className="text-xl font-bold text-slate-600 mb-6">
                Monday Prayer Connect
              </p>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                Join a thriving online community of believers connected by one purpose:
                Maximizing their dominion inheritance in Christ via a thriving
                prayer life
              </p>
              <Link
                href={`/e/${processedHeroEvent?.slug || processedHeroEvent?.id}/register`}
              >
                <Button
                  variant="outline"
                  className="w-full rounded-2xl h-14 border-slate-200 group-hover:border-purple-600 group-hover:text-purple-600 font-bold transition-all"
                >
                  Register to join
                </Button>
              </Link>
            </div>

            {}
            <div className="group relative bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-indigo-200 overflow-hidden transform md:scale-110 z-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest mb-8">
                  <Sparkles className="w-3 h-3" /> Popular
                </div>
                <h3 className="text-4xl font-black text-white mb-2">5:00 PM</h3>
                <p className="text-xl font-bold text-purple-300 mb-6">
                  Mastering the Mystery of Christ
                </p>
                <p className="text-slate-300 font-medium mb-10 leading-relaxed">
                  An hour of scriptural exposition. Together we search, find,
                  receive and ingest the truth of the word of God with evidence
                  of the life of God.
                </p>
                <a
                  href="https://meet.google.com/jhq-mnff-ekz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full rounded-2xl h-14 bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg shadow-purple-900/20">
                    Join online
                  </Button>
                </a>
              </div>
            </div>

            {}
            <div className="group bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 mb-8">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2">
                10:15 PM
              </h3>
              <p className="text-xl font-bold text-slate-600 mb-6">
                Thursday Prayer Connect
              </p>
              <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                Join a thriving online community of believers connected by one purpose:
                Maximizing their dominion inheritance in Christ via a thriving
                prayer life
              </p>
              <Link href="/prayer-meetings">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl h-14 border-slate-200 group-hover:border-purple-600 group-hover:text-purple-600 font-bold transition-all"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {}
      <Section bg="white" className="py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl">
            <div className="w-12 h-1.5 bg-purple-600 rounded-full mb-8" />
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              WELCOME TO <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">
                THE HILLZ
              </span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              The Hillz is a global movement of people who seek the Lord and a
              dwelling place with the King on the Father&apos;s Holy Hill of Zion. <br />
              Men and women, young and old who identifies with Christ&apos;s dominion
              mandate and recognizes their place as the people of His kingdom,
              His presence and His Dominion. <br />
              We are a nation of priests and kings positioned to radiate the
              glory of God to the ends of the earth, a people revealing the
              manifest presence of Jesus in every situation, to every people and
              in every place.
            </p>
            <div className="space-y-4 mb-10">
              {[
                "A life of righteousness powered by the word of God",
                "Steadfastness in fasting, prayer and communion by the grace of God",
                "Everyday dominion by the activities of the spirit of God",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 font-bold">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/about/mandate">
              <Button
                variant="primary"
                size="lg"
                className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl shadow-slate-200"
              >
                More On Our Mandate <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-tr from-purple-100 to-indigo-100 rounded-[60px] blur-2xl opacity-50" />
            <div className="relative rounded-[60px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] h-[600px]">
              <Image
                src="/welcome_to_the_hillz_landing.png"
                alt="Welcome to The Hillz"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-50 max-w-xs hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">
                    +{totalEventsCount}
                  </p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Events Hosted
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-bold italic leading-none">
                &quot;Transforming lives, one experience at a time.&quot;
              </p>
            </div>
          </div>
        </div>
      </Section>

      {}
      <Section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-purple-600 rounded-full blur-[150px] -translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-xs font-black uppercase tracking-widest mb-6">
              Life Transformations
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
              Stories of The Hillz
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Yomi Jay",
                role: "Member",
                text: "My understanding of scriptures has been greatly deepened over the years via the teachings, making my faith stronger and my prayer life has improved as well. Each session has been enriching, thought provoking and uplifting always.",
              },
              {
                name: "David T",
                role: "member",
                text: "The sermons are inspiring and relevant. I leave feeling uplifted and motivated. This platform truly feels like home.",
              },
              {
                name: "Tosin J",
                role: "Member",
                text: "The Hillz & Mastering the mystery of Christ's teachings have been a life changing experience for me, the awesome breaking down of scriptures has really helped me to re-discover myself.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10 hover:bg-white/10 transition-all duration-500 group flex flex-col h-full"
              >
                <Quote className="w-12 h-12 text-purple-500/30 mb-8 group-hover:text-purple-400 transition-colors" />
                <p className="text-xl text-white/80 font-medium mb-10 leading-relaxed italic flex-grow">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-purple-500/30 flex items-center justify-center bg-white/5">
                    <User className="w-7 h-7 text-white/50" />
                  </div>
                  <div>
                    <p className="text-white font-black">{t.name}</p>
                    <p className="text-purple-400 text-xs font-black uppercase tracking-widest">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {}
      {featuredEvents.length > 0 && (
        <Section bg="white" className="py-32">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="w-12 h-1.5 bg-[#D4AF37] rounded-full mb-8" />
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                DON&apos;T MISS <br />
                <span className="text-[#D4AF37]">THE HILLZ EXPERIENCE</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium max-w-xl">
                Our monthly and quarterly gatherings are opportunities for
                in-depth immersion in prayer and in the word of God creating
                transformative experiences.
              </p>
            </div>
            <Link href="/events">
              <Button
                size="lg"
                className="rounded-2xl h-16 px-10 border-2 border-slate-100  text-white font-black text-lg transition-all group shadow-xl"
              >
                Explore Events{" "}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>
      )}

      {}
      <Section bg="gray" className="py-32">
        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
              Latest Messages
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              Dive deep into the word with teachings that challenge and inspire.
            </p>
          </div>
          <Link href="/sermons">
            <Button
              variant="outline"
              className="rounded-full px-8 font-bold border-slate-200"
            >
              View Archive
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestSermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      </Section>

      {}
      <Section bg="white" className="py-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            Find Your Tribe
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Growth happens in circles | Don&apos;t do life alone | You need a
            community
            <br />
            <span className="text-purple-600 font-black">
              You are welcome to join the Hillz
            </span>
          </p>
        </div>

        <div className="text-center">
          <Link
            href={`/e/${processedHeroEvent?.slug || processedHeroEvent?.id}/register`}
          >
            <Button
              size="lg"
              className="rounded-2xl h-16 px-12 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg shadow-2xl shadow-purple-200"
            >
              Explore Membership
            </Button>
          </Link>
        </div>
      </Section>

      {}
      <Newsletter />

      <Footer />
    </div>
  );
}
