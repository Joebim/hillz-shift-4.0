import { z } from "zod";

export const eventVenueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const eventBrandingSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#6B46C1"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .optional(),
  bannerImage: z.string().url("Invalid banner image URL").optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  logoImage: z.string().url("Invalid logo image URL").optional(),
  backgroundPattern: z.string().optional(),
});

export const eventSpeakerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Speaker name is required"),
  title: z.string().min(1, "Speaker title is required"),
  bio: z.string().min(1, "Speaker bio is required"),
  photo: z.string().url("Invalid photo URL"),
  socialLinks: z
    .object({
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
});

export const eventScheduleItemSchema = z.object({
  id: z.string(),
  time: z.string().min(1, "Time is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  speaker: z.string().optional(),
  location: z.string().optional(),
});

export const eventFAQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const eventFormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["text", "email", "phone", "select", "radio", "checkbox"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  searchEnabled: z.boolean().optional(),
  searchDbSource: z.string().optional(),
});

export const eventTicketTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  capacity: z.number().positive().optional(),
});

export const eventRegistrationConfigSchema = z.object({
  enabled: z.boolean().default(false),
  capacity: z.number().positive().optional(),
  price: z.number().min(0, "Price must be positive").default(0),
  currency: z
    .string()
    .length(3, "Currency must be 3 characters")
    .default("NGN"),
  requiresApproval: z.boolean().default(false),
  fields: z.array(eventFormFieldSchema).default([]),
  ticketTypes: z.array(eventTicketTypeSchema).optional(),
});

export const eventInvitationConfigSchema = z.object({
  enabled: z.boolean().default(false),
  fields: z.array(eventFormFieldSchema).default([]),
});

export const eventMediaLinksSchema = z.object({
  livestreamUrl: z.string().url().optional(),
  spotifyUrl: z.string().url().optional(),
  youtubeUrl: z.string().url().optional(),
  resourcesUrl: z.string().url().optional(),
});

export const eventSponsorSchema = z.object({
  name: z.string().min(1, "Sponsor name is required"),
  logo: z.string().url("Invalid logo URL"),
  website: z.string().url().optional(),
  tier: z.enum(["platinum", "gold", "silver", "bronze"]),
});

export const eventMinisterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Minister name is required"),
  position: z.string().min(1, "Position is required"),
  type: z.enum(["primary", "secondary", "guest", "other"]),
  photo: z.string().url("Invalid photo URL").optional(),
  bio: z.string().optional(),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().url("Invalid Facebook URL").optional(),
    })
    .optional(),
});

export const eventBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Event title is required")
    .max(200, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(300, "Short description too long"),

  eventBibleVerse: z.string().optional(),
  theme: z.string().optional(),
  themeBibleVerse: z.string().optional(),
  contacts: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  ministers: z.array(eventMinisterSchema).optional(),
  channels: z
    .array(
      z.object({
        id: z.string().optional(),
        barcode: z.string().optional(),
        name: z.string().min(1, "Channel name is required"),
        image: z.string().url("Invalid channel image URL").optional(),
        link: z.string().url("Invalid channel link").optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        otherContacts: z.array(z.string()).optional(),
      }),
    )
    .optional(),

  status: z.enum([
    "draft",
    "published",
    "upcoming",
    "ongoing",
    "completed",
    "archived",
  ]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationOpenDate: z.coerce.date().optional(),
  registrationCloseDate: z.coerce.date().optional(),

  venue: eventVenueSchema,

  branding: eventBrandingSchema,

  category: z.enum([
    "conference",
    "workshop",
    "retreat",
    "seminar",
    "service",
    "other",
  ]),
  tags: z.array(z.string()).default([]),
  speakers: z.array(eventSpeakerSchema).default([]),
  schedule: z.array(eventScheduleItemSchema).default([]),
  faqs: z.array(eventFAQSchema).default([]),

  registrationConfig: eventRegistrationConfigSchema,
  invitationConfig: eventInvitationConfigSchema.default({
    enabled: false,
    fields: [],
  }),

  mediaLinks: eventMediaLinksSchema.optional(),

  sponsors: z.array(eventSponsorSchema).optional(),

  featured: z.boolean(),
});

export const createEventSchema = eventBaseSchema
  .extend({ slug: z.string().optional() })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (!data.registrationOpenDate || !data.registrationCloseDate)
        return true;
      return data.registrationCloseDate >= data.registrationOpenDate;
    },
    {
      message: "Registration close date must be after open date",
      path: ["registrationCloseDate"],
    },
  );

export const updateEventSchema = eventBaseSchema.partial();

export const eventQuerySchema = z.object({
  status: z
    .enum([
      "draft",
      "published",
      "upcoming",
      "ongoing",
      "completed",
      "archived",
    ])
    .optional(),
  category: z
    .enum(["conference", "workshop", "retreat", "seminar", "service", "other"])
    .optional(),
  featured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQueryParams = z.infer<typeof eventQuerySchema>;
