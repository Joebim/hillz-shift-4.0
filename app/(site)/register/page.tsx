import { Banner } from '@/src/components/shared/Banner';
import { EventHeader } from '@/src/components/shared/EventHeader';
import { Footer } from '@/src/components/shared/Footer';
import { RegistrationForm } from '@/src/components/register/RegistrationForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-white">
            <Banner />
            <EventHeader />

            <main className="container mx-auto container-px py-16 md:py-24">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Register Now</h2>
                    <p className="mt-4 text-gray-600">Please fill out the form below to secure your attendance.</p>
                </div>

                <RegistrationForm />
            </main>

            <Footer />
        </div>
    );
}
