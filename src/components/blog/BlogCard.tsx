import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/src/types/blog';
import { Card } from '@/src/components/ui/Card';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';

export interface BlogCardProps {
    post: BlogPost;
    layout?: 'grid' | 'list';
}

export const BlogCard = ({ post, layout = 'grid' }: BlogCardProps) => {
    if (layout === 'list') {
        return (
            <Card variant="default" padding="none" hover className="overflow-hidden flex flex-col md:flex-row h-full bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1 group">
                <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto overflow-hidden">
                    <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center w-full md:w-2/3">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600">
                            {post.category}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-500" />
                            {formatDate(post.publishedDate || post.createdAt, 'short')}
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 hover:text-purple-600 transition-colors tracking-tight leading-tight">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-slate-500 font-bold mb-8 line-clamp-2 md:line-clamp-3 text-sm leading-relaxed max-w-xl">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                                {post.author.photo ? (
                                    <Image src={post.author.photo} alt={post.author.name} width={32} height={32} className="object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{post.author.name}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                            <Button variant="ghost" className="rounded-full font-black text-xs uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 px-6 gap-2 group/btn">
                                Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="default" padding="none" hover className="overflow-hidden h-full flex flex-col group bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-2">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-6 left-6">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl">
                        {post.category}
                    </div>
                </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>{formatDate(post.publishedDate || post.createdAt, 'short')}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 hover:text-purple-600 transition-colors tracking-tight leading-tight">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-slate-500 font-bold text-sm mb-8 line-clamp-3 flex-1 leading-relaxed">
                    {post.excerpt}
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-100 overflow-hidden">
                            {post.author.photo ? (
                                <Image src={post.author.photo} alt={post.author.name} width={24} height={24} className="object-cover" />
                            ) : (
                                <User className="w-3 h-3 text-slate-400" />
                            )}
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{post.author.name}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="h-auto p-0 font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-purple-600 bg-transparent hover:bg-transparent transition-colors">
                            Read More
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};
