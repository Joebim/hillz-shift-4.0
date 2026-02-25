import { notFound } from 'next/navigation';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { Button } from '@/src/components/ui/Button';
import Link from 'next/link';

export default async function SuccessPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const events = await queryDocuments<Event>('events', { slug: eventId });
    if (!events.length) return notFound();
    const event = events[0];

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto container-px py-16 md:py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-3xl border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-16 shadow-lg text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-200">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4" style={{ color: event.branding.primaryColor || '#000' }}>
                            Success!
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto font-medium">
                            Your action was completed successfully. Check your email for confirmation details regarding <strong className="text-gray-900">{event.title}</strong>!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={`/e/${eventId}`}>
                                <Button size="lg" className="rounded-2xl w-full sm:w-auto tracking-wider font-bold">
                                    Return to Event Page
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
