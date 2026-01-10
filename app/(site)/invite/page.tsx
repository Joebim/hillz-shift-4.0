import { Banner } from '@/src/components/shared/Banner';
import { EventHeader } from '@/src/components/shared/EventHeader';
import { Footer } from '@/src/components/shared/Footer';
import { InvitationForm } from '@/src/components/invite/InvitationForm';

export default function InvitePage() {
    return (
        <div className="min-h-screen bg-white">
            <Banner />
            <EventHeader />

            <main className="container mx-auto container-px py-16 md:py-24">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Invite Someone</h2>
                    <p className="mt-4 text-gray-600">Spread the word and invite your friends and family.</p>
                </div>

                <InvitationForm />
            </main>

            <Footer />
        </div>
    );
}
