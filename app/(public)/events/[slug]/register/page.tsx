import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { EventRegistrationForm } from '@/src/components/events/EventRegistrationForm';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const events = await queryDocuments<Event>('events', { slug });
    const event = events[0];

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: `Register for ${event.title} | Ministry Platform`,
        description: `Register for ${event.title} - ${event.shortDescription}`,
    };
}

export default async function EventRegistrationPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const events = await queryDocuments<Event>('events', { slug });
    const event = events[0];

    if (!event) {
        notFound();
    }

    if (!event.registrationConfig.enabled) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#F3EFFF] via-[#F8FAFC] to-[#FEF3E2]">
            <Header />

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <EventRegistrationForm event={event} />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
