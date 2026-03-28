import { Timestamp } from "firebase/firestore";

export type EventStatus =
  | "draft"
  | "published"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "archived";

export type EventCategory =
  | "conference"
  | "workshop"
  | "retreat"
  | "seminar"
  | "service"
  | "other";

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventBranding {
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  bannerImage?: string;
  thumbnail?: string;
  logoImage?: string;
  backgroundPattern?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface EventScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  location?: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventFormField {
  id: string;
  label: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "select"
    | "radio"
    | "textarea"
    | "checkbox";
  required: boolean;
  options?: string[];
  placeholder?: string;
  searchEnabled?: boolean;
  searchDbSource?: string;
}

export interface EventTicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  capacity?: number;
}

export interface EventRegistrationConfig {
  enabled: boolean;
  capacity?: number;
  price: number;
  currency: string;
  requiresApproval: boolean;
  fields: EventFormField[];
  ticketTypes?: EventTicketType[];
}

export interface EventInvitationConfig {
  enabled: boolean;
  fields: EventFormField[];
}

export interface EventMediaLinks {
  livestreamUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  resourcesUrl?: string;
}

export interface EventSponsor {
  name: string;
  logo: string;
  website?: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
}

export interface EventChannel {
  id?: string;
  barcode?: string;
  name: string;
  image?: string;
  link?: string;
  title?: string;
  description?: string;
  color?: string;
  otherContacts?: string[];
}

export interface EventMinister {
  id: string;
  name: string;
  position: string; 
  type: "primary" | "secondary" | "guest" | "other";
  photo?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  eventBibleVerse?: string;
  theme?: string;
  themeBibleVerse?: string;
  contacts?: string[];
  links?: string[];
  footerText?: string;
  bannerText?: string;
  channels?: EventChannel[];
  ministers?: EventMinister[];

  status: EventStatus;
  startDate: Timestamp | Date | string;
  endDate: Timestamp | Date | string;
  registrationOpenDate: Timestamp | Date | string;
  registrationCloseDate: Timestamp | Date | string;

  venue: EventVenue;

  branding: EventBranding;

  category: EventCategory;
  isMembershipForm?: boolean;
  tags: string[];
  speakers: EventSpeaker[];
  schedule: EventScheduleItem[];
  faqs: EventFAQ[];

  registrationConfig: EventRegistrationConfig;
  invitationConfig: EventInvitationConfig;

  mediaLinks: EventMediaLinks;

  sponsors?: EventSponsor[];

  featured: boolean;
  registrationCount: number;
  invitationCount: number;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
  createdBy: string;
}

export type CreateEventInput = Omit<
  Event,
  | "id"
  | "registrationCount"
  | "invitationCount"
  | "createdAt"
  | "updatedAt"
  | "createdBy"
>;
export type UpdateEventInput = Partial<CreateEventInput>;

export interface EventFilters {
  status?: EventStatus | EventStatus[];
  category?: EventCategory | EventCategory[];
  featured?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface EventWithComputed extends Event {
  isUpcoming: boolean;
  isOngoing: boolean;
  isCompleted: boolean;
  daysUntilStart: number;
  registrationOpen: boolean;
}
