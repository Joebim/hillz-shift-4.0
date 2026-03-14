import { cn } from '@/src/lib/utils';

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-4 border-slate-200 border-t-violet-600',

                size === 'sm' && 'w-4 h-4 border-2',
                size === 'md' && 'w-8 h-8',
                size === 'lg' && 'w-12 h-12',
                size === 'xl' && 'w-16 h-16',

                className
            )}
        />
    );
};

export interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
}

export const Loading = ({ text = 'Loading...', fullScreen = false }: LoadingProps) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-xl border border-slate-100">
                    <Spinner size="lg" />
                    <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Spinner size="lg" />
            <p className="text-slate-500 font-medium">{text}</p>
        </div>
    );
};
