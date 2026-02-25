import { InvitationForm } from '@/src/components/invite/InvitationForm';
import { notFound } from 'next/navigation';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { Event } from '@/src/types/event';
import { serializeFirestoreData } from '@/src/lib/utils';

export default async function InvitePage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const events = await queryDocuments<Event>('events', { slug: eventId });
    if (!events.length) return notFound();
    const event = serializeFirestoreData(events[0]);

    // ── DEBUG: log form config coming from Firestore ──────────────────────────
    console.log('[InvitePage] event.invitationConfig:', JSON.stringify(event.invitationConfig, null, 2));
    console.log('[InvitePage] event.invitationConfig.fields:', JSON.stringify(event.invitationConfig?.fields, null, 2));

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto container-px py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl md:rounded-[3rem] border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-12 lg:p-20 shadow-lg relative overflow-hidden mb-12">
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" style={{ backgroundColor: event.branding.primaryColor ? `${event.branding.primaryColor}20` : undefined }}></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl md:text-5xl font-black text-primary-dark uppercase tracking-tighter leading-tight" style={{ color: event.branding.primaryColor || '#000' }}>Invite Someone</h2>
                            <p className="mt-4 text-gray-600">Spread the word and invite your friends and family to {event.title}.</p>
                        </div>
                    </div>

                    {/* We pass the event config to the form so it renders the dynamic fields */}
                    <InvitationForm eventId={event.id} config={event.invitationConfig} />
                </div>
            </main>
        </div>
    );
}
