import { Banner } from '@/src/components/shared/Banner';
import { EventHeader } from '@/src/components/shared/EventHeader';
import { Footer } from '@/src/components/shared/Footer';
import { InvitationForm } from '@/src/components/invite/InvitationForm';

export default function InvitePage() {
    return (
        <div className="min-h-screen bg-white">
            <Banner />
            <EventHeader />

            <main className="container mx-auto container-px py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl md:rounded-[3rem] border-2 border-primary/10 bg-linear-to-br from-white via-primary/5 to-white p-8 md:p-12 lg:p-20 shadow-lg relative overflow-hidden mb-12">
                        {/* Decorative circles */}
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>

                        <div className="relative z-10 text-center">
                            <h2 className="text-3xl md:text-5xl font-black text-primary-dark uppercase tracking-tighter leading-tight">Invite Someone</h2>
                            <p className="mt-4 text-gray-600">Spread the word and invite your friends and family.</p>
                        </div>
                    </div>

                    <InvitationForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}
