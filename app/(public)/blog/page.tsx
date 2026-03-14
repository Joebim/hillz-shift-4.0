import Image from 'next/image';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { BlogPost } from '@/src/types/blog';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { BlogCard } from '@/src/components/blog/BlogCard';
import { Section } from '@/src/components/shared/Section';
import { BookOpen, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Blog | Hillz Shift 4.0',
    description: 'Read our latest articles, stories, and updates.',
};

export default async function BlogPage() {
    const rawPosts = await queryDocuments<BlogPost>('blog', { status: 'published' }, 'publishedDate', 100);

    const posts = rawPosts.map(post => ({
        ...post,
        publishedDate: post.publishedDate ? toJsDate(post.publishedDate) : undefined,
        createdAt: toJsDate(post.createdAt),
        updatedAt: toJsDate(post.updatedAt),
    }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <section className="relative pt-48 pb-32 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-slate-900 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                        alt="Blog"
                        fill
                        className="object-cover opacity-60 animate-slow-zoom"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in-up">
                            <BookOpen className="w-3 h-3" />
                            Wisdom & Stories
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none animate-fade-in-up">
                            WORDS THAT <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-300 to-indigo-400">IGNITE CHANGE</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl font-medium animate-fade-in-up delay-100 italic">
                            &quot;Your word is a lamp to my feet and a light to my path.&quot; — Psalm 119:105
                        </p>
                    </div>
                </div>

                {}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-linear-to-tl from-emerald-600/20 to-transparent blur-3xl" />
            </section>

            {}
            <Section bg="gray" className="py-24">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Recent Articles</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100">
                        <p className="text-xl text-slate-400 font-bold leading-relaxed">
                            New stories are being written. <br /> Check back soon for fresh insights.
                        </p>
                    </div>
                )}
            </Section>

            <Footer />
        </div>
    );
}
