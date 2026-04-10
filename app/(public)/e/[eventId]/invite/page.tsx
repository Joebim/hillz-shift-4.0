import { Banner } from '@/src/components/shared/Banner';
import { EventBannerHeader } from '@/src/components/shared/EventBannerHeader';
import { Footer } from '@/src/components/shared/Footer';
import { InvitationForm } from '@/src/components/invite/InvitationForm';
import { notFound } from 'next/navigation';
import { queryDocuments, getDocument } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { serializeFirestoreData } from '@/src/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }): Promise<Metadata> {
    const { eventId } = await params;
    let ArrayEvents = await queryDocuments<Event>('events', { slug: eventId });
    let event: Event | null = ArrayEvents.length > 0 ? ArrayEvents[0] : null;

    if (!event) {
        event = await getDocument<Event>('events', eventId);
    }

    if (!event) return { title: 'Invite Friends | The Hillz' };

    return {
        title: `Invite Friends to ${event.title} | The Hillz`,
        description: `You are invited to ${event.title}. Register now and join us for a life-changing encounter.`,
        openGraph: {
            title: `Invitation: ${event.title}`,
            description: event.description,
            images: event.branding.bannerImage ? [{ url: event.branding.bannerImage }] : [],
        },
    };
}

export default async function InvitePage({ params }: { params: Promise<{ eventId: string }> }) {
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
            <Banner text={event.bannerText} />
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

                        <div className="relative z-10">
                            <h2
                                className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-center"
                                style={{ color: eventData.branding.primaryColor || '#000' }}
                            >
                                Invite Friends
                            </h2>
                            <p className="mt-4 text-gray-600 text-center">
                                Send personalized invitations for <strong>{eventData.title}</strong> to your friends and family.
                            </p>
                        </div>
                    </div>

                    <InvitationForm 
                        eventId={eventData.id} 
                        eventSlug={eventData.slug} 
                        eventTitle={eventData.title} 
                        config={eventData.invitationConfig} 
                    />
                </div>
            </main>

            <Footer event={event} />
        </div>
    );
}
