import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/firebaseAdmin';
import { getSession } from '@/src/lib/auth/session';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // Check if already exists
        const existing = await db.collection('newsletter').where('email', '==', email).get();
        if (!existing.empty) {
            return NextResponse.json({ message: 'Already subscribed' });
        }

        await db.collection('newsletter').add({
            email,
            subscribedAt: new Date(),
            active: true
        });

        return NextResponse.json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const snapshot = await db.collection('newsletter').orderBy('subscribedAt', 'desc').get();
        const emails = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            subscribedAt: doc.data().subscribedAt?.toDate?.() || doc.data().subscribedAt
        }));

        return NextResponse.json({ data: emails });
    } catch (error) {
        console.error('Newsletter fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch newsletter emails' }, { status: 500 });
    }
}
