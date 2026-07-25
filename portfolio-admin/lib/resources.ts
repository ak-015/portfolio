// Config-driven CRUD for every "flat" content model (no nested relations
// of their own). Nested models (Project, Experience, BlogPost, Hobby +
// its sub-tree) get bespoke pages instead — see app/dashboard/{projects,
// experience,blog,hobbies}. Adding a new flat resource means adding one
// entry here; the dynamic route app/dashboard/[resource]/page.tsx and the
// generic /api/pending endpoint handle the rest.

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "icon";

export type ResourceField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[]; // for "select"
};

export type ResourceConfig = {
  key: string; // used in URLs: /dashboard/[key]
  model: string; // must match a case in lib/applyChange.ts + a Prisma delegate name
  section: string; // PendingChange.section — its own "Send OTP" batch
  label: string;
  description: string;
  fields: ResourceField[];
  listColumns: string[]; // subset of field names shown in the table
  orderable?: boolean;
};

export const RESOURCES: Record<string, ResourceConfig> = {
  "social-links": {
    key: "social-links",
    model: "socialLink",
    section: "social-links",
    label: "Social Links",
    description: "Icons shown in the hero, footer, and contact page.",
    fields: [
      { name: "platform", label: "Platform", type: "text", required: true },
      { name: "url", label: "URL", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true },
      { name: "visible", label: "Visible", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["platform", "url", "visible", "order"],
    orderable: true,
  },
  "quick-links": {
    key: "quick-links",
    model: "quickLink",
    section: "quick-links",
    label: "Footer Links",
    description: "Footer 'Quick Links' and 'Services' columns.",
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Link", type: "text", required: true },
      {
        name: "section",
        label: "Column",
        type: "select",
        required: true,
        options: [
          { value: "quick", label: "Quick Links" },
          { value: "services", label: "Services" },
        ],
      },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["label", "href", "section", "order"],
    orderable: true,
  },
  stats: {
    key: "stats",
    model: "stat",
    section: "stats",
    label: "Stat Strips",
    description: "Numbered stat tiles shown on Home, About, and Experience.",
    fields: [
      {
        name: "context",
        label: "Page",
        type: "select",
        required: true,
        options: [
          { value: "HOME", label: "Home" },
          { value: "ABOUT", label: "About" },
          { value: "EXPERIENCE", label: "Experience" },
        ],
      },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["context", "label", "value", "order"],
    orderable: true,
  },
  services: {
    key: "services",
    model: "serviceItem",
    section: "services",
    label: "Services (\"What I Do\")",
    description: "Service tiles on the home page.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["title", "description", "order"],
    orderable: true,
  },
  technologies: {
    key: "technologies",
    model: "technology",
    section: "technologies",
    label: "Tech Stack",
    description: "Shared by the About page tech grid and each project's tech chips.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "icon", label: "Icon", type: "icon", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { value: "LANGUAGES", label: "Languages" },
          { value: "FRONTEND", label: "Frontend" },
          { value: "BACKEND", label: "Backend" },
          { value: "DATABASE", label: "Database" },
          { value: "TOOLS", label: "Tools" },
          { value: "MOBILE", label: "Mobile" },
          { value: "OTHER", label: "Other" },
        ],
      },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["name", "category", "order"],
    orderable: true,
  },
  "project-categories": {
    key: "project-categories",
    model: "projectCategory",
    section: "project-categories",
    label: "Project Categories",
    description: "Powers the /projects filter bar. Deleting a category in use is blocked — reassign its projects first.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["name", "slug", "order"],
    orderable: true,
  },
  "key-subjects": {
    key: "key-subjects",
    model: "keySubject",
    section: "education",
    label: "Key Subjects",
    description: "Tag grid on the Education page.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["name", "order"],
    orderable: true,
  },
  achievements: {
    key: "achievements",
    model: "achievement",
    section: "education",
    label: "Academic Achievements",
    description: "Icon + title + description list on the Education page.",
    fields: [
      { name: "icon", label: "Icon", type: "icon", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["title", "description", "order"],
    orderable: true,
  },
  "education-entries": {
    key: "education-entries",
    model: "educationEntry",
    section: "education",
    label: "Education Timeline",
    description: "Degree/institution entries shown on the Education page.",
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "startDate", label: "Start", type: "text", required: true },
      { name: "endDate", label: "End", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "COMPLETED", label: "Completed" },
          { value: "IN_PROGRESS", label: "In Progress" },
        ],
      },
      { name: "gpaOrPercentage", label: "GPA / Percentage", type: "text" },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["degree", "institution", "status", "order"],
    orderable: true,
  },
  certificates: {
    key: "certificates",
    model: "certificate",
    section: "certificates",
    label: "Certificates",
    description: "Certificate cards on the Education page.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "imageUrl", label: "Certificate Image", type: "text", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
    listColumns: ["title", "order"],
    orderable: true,
  },
};

export const RESOURCE_LIST = Object.values(RESOURCES);
