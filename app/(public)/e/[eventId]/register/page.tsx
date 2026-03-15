import { Banner } from '@/src/components/shared/Banner';
import { EventBannerHeader } from '@/src/components/shared/EventBannerHeader';
import { Footer } from '@/src/components/shared/Footer';
import { RegistrationForm } from '@/src/components/register/RegistrationForm';
import { notFound } from 'next/navigation';
import { queryDocuments, getDocument } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { serializeFirestoreData } from '@/src/lib/utils';

export default async function RegisterPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    let ArrayEvents = await queryDocuments<Event>('events', { slug: eventId });
    let event: Event | null = ArrayEvents.length > 0 ? ArrayEvents[0] : null;

    if (!event) {
        event = await getDocument<Event>('events', eventId);
    }

    if (!event) return notFound();
    const eventData = serializeFirestoreData(event);

    return (
        <div className="min-h-screen bg-white">
            <Banner />
            <EventBannerHeader
                bannerImage={eventData.branding.bannerImage}
                title={eventData.title}
                primaryColor={eventData.branding.primaryColor}
                secondaryColor={eventData.branding.secondaryColor}
            />

            <main className="container mx-auto container-px py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl md:rounded-[3rem] border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-12 lg:p-20 shadow-lg relative overflow-hidden mb-12">
                        {/* Decorative circles */}
                        <div
                            className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
                            style={{ backgroundColor: eventData.branding.primaryColor ? `${eventData.branding.primaryColor}20` : 'rgba(107,70,193,0.1)' }}
                        ></div>
                        <div
                            className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
                            style={{ backgroundColor: eventData.branding.accentColor ? `${eventData.branding.accentColor}15` : 'rgba(212,175,55,0.1)' }}
                        ></div>

                        <div className="relative z-10 text-center">
                            <h2
                                className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight"
                                style={{ color: eventData.branding.primaryColor || '#000' }}
                            >
                                Register Now
                            </h2>
                            <p className="mt-4 text-gray-600">
                                Please fill out the form below to secure your spot for <strong>{eventData.title}</strong>.
                            </p>
                        </div>
                    </div>

                    <RegistrationForm eventId={eventData.id} eventSlug={eventData.slug} config={eventData.registrationConfig} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
