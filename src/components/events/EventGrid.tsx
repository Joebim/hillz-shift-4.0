'use client';

import { useState } from 'react';
import { Event } from '@/src/types/event';
import { EventCard } from './EventCard';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/src/components/ui/Input';

export interface EventGridProps {
    events: Event[];
}

const categories = ['all', 'conference', 'workshop', 'retreat', 'seminar', 'service', 'other'];

export const EventGrid = ({ events }: EventGridProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

    const filteredEvents = events.filter((event) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.shortDescription.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        if (selectedCategory !== 'all' && event.category !== selectedCategory) {
            return false;
        }

        if (showFeaturedOnly && !event.featured) {
            return false;
        }

        return true;
    });

    return (
        <div>
            {}
            <div className="mb-8 space-y-4">
                {}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12"
                    />
                </div>

                {}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                    ? 'bg-[#6B46C1] text-white shadow-lg'
                                    : 'bg-[#F3F4F6] text-[#475569] hover:bg-[#E5E7EB]'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showFeaturedOnly
                                ? 'bg-[#D4AF37] text-[#1F2937] shadow-lg'
                                : 'bg-[#F3F4F6] text-[#475569] hover:bg-[#E5E7EB]'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Featured Only
                    </button>

                    <span className="text-[#6B7280]">
                        {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                    </span>
                </div>
            </div>

            {}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[#9CA3AF]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">No events found</h3>
                    <p className="text-[#6B7280] mb-6">
                        Try adjusting your filters or search query
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setShowFeaturedOnly(false);
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
};
