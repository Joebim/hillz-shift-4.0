import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { queryDocuments } from '@/src/lib/firebase/firestore';
import { toJsDate } from '@/src/lib/utils';
import { BlogPost } from '@/src/types/blog';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { Section } from '@/src/components/shared/Section';
import { Calendar, User, Tag, ArrowLeft, Sparkles } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import { BlogCard } from '@/src/components/blog/BlogCard';
import { Button } from '@/src/components/ui/Button';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const posts = await queryDocuments<BlogPost>('blog', { slug });
    const post = posts[0];

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Hillz Shift 4.0`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const posts = await queryDocuments<BlogPost>('blog', { slug });
    const post = posts[0] ? {
        ...posts[0],
        publishedDate: posts[0].publishedDate ? toJsDate(posts[0].publishedDate) : undefined,
        createdAt: toJsDate(posts[0].createdAt),
        updatedAt: toJsDate(posts[0].updatedAt),
    } : null;

    if (!post) notFound();

    const relatedPostsRaw = await queryDocuments<BlogPost>('blog', { category: post.category }, 'publishedDate', 4);
    const relatedPosts = relatedPostsRaw
        .filter(p => p.id !== post.id)
        .slice(0, 3)
        .map(p => ({
            ...p,
            publishedDate: p.publishedDate ? toJsDate(p.publishedDate) : undefined,
            createdAt: toJsDate(p.createdAt),
            updatedAt: toJsDate(p.updatedAt),
        }));

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {}
            <div className="relative pt-48 pb-64 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-slate-900/40 to-white z-10" />
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover opacity-60 animate-slow-zoom"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors font-black text-[10px] uppercase tracking-[0.3em] group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="bg-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                                {post.category}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/80 uppercase tracking-widest">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                {formatDate(post.publishedDate || post.createdAt, 'long')}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[0.9] animate-fade-in-up">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            {}
            <div className="container mx-auto px-6 relative z-20 -mt-24 mb-16">
                <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-purple-900/10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-[28px] overflow-hidden border-4 border-slate-50 shadow-lg">
                            {post.author.photo ? (
                                <Image src={post.author.photo} alt={post.author.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-2xl uppercase">
                                    {post.author.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Written By</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{post.author.name}</h3>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {post.tags.map(tag => (
                            <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                                <Tag className="w-3.5 h-3.5" />
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {}
            <div className="container mx-auto px-6 max-w-4xl mb-32">
                <article className="prose prose-2xl prose-purple max-w-none text-slate-600 leading-relaxed font-medium selection:bg-purple-100 selection:text-purple-900">
                    {post.content.split('\n').map((paragraph, idx) => (
                        paragraph.trim() && (
                            <p key={idx} className="mb-8 first-letter:text-5xl first-letter:font-black first-letter:text-purple-600 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                {paragraph}
                            </p>
                        )
                    ))}
                </article>
            </div>

            {}
            <Section bg="gray" className="py-32">
                <div className="flex items-center justify-center gap-3 mb-16">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase text-center">More from the Shift</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {relatedPosts.map((p) => (
                        <BlogCard key={p.id} post={p} />
                    ))}
                </div>
                {relatedPosts.length === 0 && (
                    <p className="text-center w-full text-slate-400 font-bold">No other articles in this category yet.</p>
                )}
            </Section>

            <Footer />
        </div>
    );
}
