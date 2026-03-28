import { Banner } from '@/src/components/shared/Banner';
import { Footer } from '@/src/components/shared/Footer';
import { Button } from '@/src/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryDocuments, getDocument } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';

export default async function SuccessPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    let ArrayEvents = await queryDocuments<Event>('events', { slug: eventId });
    let event: Event | null = ArrayEvents.length > 0 ? ArrayEvents[0] : null;

    if (!event) {
        event = await getDocument<Event>('events', eventId);
    }

    if (!event) return notFound();
    const eventSlug = event.slug || eventId;

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Banner text={event.bannerText} />

            <main className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md rounded-2xl md:rounded-3xl bg-white p-6 md:p-8 lg:p-12 text-center shadow-xl">
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-green-100 p-4 text-green-600">
                            <CheckCircle2 size={48} />
                        </div>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Registration Successful!</h1>
                    <p className="mb-8 text-gray-600">
                        Thank you for registering. A confirmation email has been sent to your inbox for {event.title}.
                    </p>

                    <div className="flex flex-col gap-4">
                        {event.invitationConfig?.enabled && (
                            <Link href={`/e/${eventSlug}/invite`} className="w-full">
                                <Button className="w-full" size="lg">Invite a Friend</Button>
                            </Link>
                        )}
                        <Link href={`/e/${eventSlug}`} className="w-full">
                            <Button variant="outline" className="w-full" size="lg">Back to Event Page</Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer event={event} />
        </div>
    );
}
