import { PrismaClient, ProjectCategory, FieldInputType } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder Cloudinary-style URLs — swap for real uploads via the admin
// portal. Using Unsplash-style stable placeholders here so the site renders
// correctly out of the box.
const IMG = {
  profile: "https://res.cloudinary.com/devszseep/image/upload/v1784277628/portfolio/nejm86cearxzkzestdzm.jpg",
  rideShare: "https://res.cloudinary.com/devszseep/image/upload/v1784193691/Screenshot_2026-07-16_144805_kttjle.png",
  civilEngineer: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/civil-engineer.jpg",
  taskflow: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/taskflow.jpg",
  urlShortener: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/url-shortener.jpg",
  canalReport: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/education/syl-bml-canal.jpg",
  blogGeneric: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/blog/generic-cover.jpg",
  photography: "https://res.cloudinary.com/devszseep/image/upload/v1784458755/ChatGPT_Image_Jul_19_2026_04_29_00_PM_h56kow.png",
  books: "https://res.cloudinary.com/devszseep/image/upload/v1784458700/ChatGPT_Image_Jul_19_2026_04_28_03_PM_ihfbo6.png",
  games: "https://res.cloudinary.com/devszseep/image/upload/v1784458567/ChatGPT_Image_Jul_19_2026_04_25_44_PM_rlqyuo.png",
};

async function main() {
  console.log("Seeding database...");

  // ---------------- About / Hero ----------------
  await prisma.aboutContent.upsert({
    where: { section: "hero" },
    update: {},
    create: {
      section: "hero",
      name: "Ankit Kumar",
      body: "I build beautiful, functional and user-centric digital experiences that solve real-world problems — with the analytical rigor of an engineer.",
      profileImageUrl: IMG.profile,
      resumeUrl: "#",
    },
  });

  await prisma.aboutContent.upsert({
    where: { section: "about_intro" },
    update: {},
    create: {
      section: "about_intro",
      name: "Ankit Kumar",
      email: "ankit238219@gmail.com",
      phone: "+91 95346 23781",
      location: "Yamuna Nagar, Haryana, India",
      languages: "English, Hindi",
      educationLabel: "B.Tech Civil Engineering, NIT Kurukshetra",
      body:
        "I'm a Civil Engineer by degree and a developer by passion. That dual background is my differentiator: I bring analytical, standards-driven engineering rigor — the same discipline used to design canal slopes and structural systems — into building production-grade software. Where most developers learn to ship features, I first learned to reason about loads, tolerances, and failure modes, and I apply that same rigor to architecture, data modeling, and code quality today.",
      profileImageUrl: IMG.profile,
      resumeUrl: "#",
    },
  });

  await prisma.roleTitle.deleteMany();
  await prisma.roleTitle.createMany({
    data: [
      { title: "Full Stack Developer", order: 0 },
      { title: "Civil Engineer", order: 1 },
      { title: "building Territory Run", order: 2 },
    ],
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "github", url: "https://github.com/ak-015", icon: "github", order: 0 },
      { platform: "linkedin", url: "https://www.linkedin.com/in/ankit-kumar-29ba252ba/", icon: "linkedin", order: 1 },
      { platform: "instagram", url: "https://instagram.com/__ak_015", icon: "instagram", order: 2 },
      // { platform: "youtube", url: "https://youtube.com/", icon: "youtube", order: 3 },
    ],
  });

  // ---------------- Stats ----------------
  await prisma.statItem.deleteMany();
  await prisma.statItem.createMany({
    data: [
      { label: "Projects Completed", value: "5", icon: "file-text", order: 0 },
      { label: "Technologies", value: "15", icon: "cpu", order: 1 },
      { label: "Years Experience", value: "0", icon: "briefcase", order: 2 },
      { label: "Certifications", value: "4", icon: "award", order: 3 },
      { label: "Dedication", value: "100%", icon: "target", order: 4 },
    ],
  });

  // ---------------- Services ----------------
  await prisma.serviceItem.deleteMany();
  await prisma.serviceItem.createMany({
    data: [
      { title: "Web Development", description: "Modern websites with great UI/UX", icon: "code", order: 0 },
      { title: "Backend Development", description: "Scalable and reliable backends", icon: "server", order: 1 },
      { title: "UI/UX Design", description: "Beautiful and intuitive designs", icon: "pen-tool", order: 2 },
      { title: "Database Design", description: "Optimized and reliable databases", icon: "database", order: 3 },
      { title: "Civil Engineering Solutions", description: "Estimation, design, and analysis", icon: "tool", order: 4 },
      { title: "GIS & Mapping", description: "ArcGIS-based spatial analysis", icon: "compass", order: 5 },
    ],
  });

  // ---------------- Tech stack ----------------
  await prisma.techStackItem.deleteMany();
  const tech: { category: string; name: string; icon: string }[] = [
    { category: "Languages", name: "TypeScript", icon: "typescript" },
    { category: "Languages", name: "JavaScript", icon: "javascript" },
    { category: "Languages", name: "Python", icon: "python" },
    { category: "Frontend", name: "React", icon: "react" },
    { category: "Frontend", name: "Next.js", icon: "nextjs" },
    { category: "Frontend", name: "Tailwind CSS", icon: "tailwindcss" },
    { category: "Backend", name: "Node.js", icon: "nodejs" },
    { category: "Backend", name: "Express.js", icon: "express" },
    { category: "Backend", name: "Prisma", icon: "prisma" },
    { category: "Database", name: "PostgreSQL", icon: "postgresql" },
    { category: "Database", name: "MongoDB", icon: "mongodb" },
    { category: "Tools", name: "Git", icon: "git" },
    { category: "Tools", name: "Postman", icon: "postman" },
    { category: "Other", name: "ArcGIS", icon: "arcgis" },
    { category: "Other", name: "STAAD.Pro", icon: "tool" },
  ];
  await prisma.techStackItem.createMany({
    data: tech.map((t, i) => ({ ...t, order: i })),
  });

  // ---------------- Projects ----------------
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      slug: "ride-share",
      title: "ride_share",
      summary: "Ride-sharing app for students with domain-restricted signup.",
      description: `ride_share is a ride-sharing platform built specifically for students. Signup is domain-restricted so only verified students with a college email can see ride listings or contact one another, keeping the community trustworthy and safe.

Users create an account, verify their identity via OTP, publish or search for rides by source, destination, date, and time, and send ride requests. An integrated real-time chat, built with Socket.IO, lets 2-students coordinate before and during the trip.

The frontend is built with React and Vite for a fast development experience, while the backend runs on Node.js and Express with PostgreSQL via Prisma. An admin dashboard supports managing users, rides, and platform activity.`,
      coverImageUrl: IMG.rideShare,
      category: ProjectCategory.WEB,
      featured: true,
      liveUrl: "https://ride-share-7b04.onrender.com/",
      githubUrl: "https://github.com/lab942004/ride_sharing",
      technologies: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "Socket.IO"],
      keyFeatures: [
        "Domain-restricted signup — only verified students can join",
        "OTP-based email verification before accessing ride listings",
        "Create, edit, and manage ride listings",
        "Search rides by source, destination, date, and time",
        "Send, accept, or reject ride requests",
        "Real-time chat between drivers and passengers via Socket.IO",
        "Responsive design for web and mobile devices",
        "Admin dashboard for user and ride management",
      ],
      techStackDetail: {
        Frontend: "React, Vite",
        Backend: "Node.js, Express.js",
        Database: "PostgreSQL (Prisma ORM)",
        Realtime: "Socket.IO",
        Auth: "OTP-based email verification, domain-restricted signup",
      },
      order: 0,
    },
  });

  await prisma.project.create({
    data: {
      slug: "civil-engineer-working",
      title: "Civil Engineer Working",
      summary: "Full-stack app with production-ready OTP email verification and login gating.",
      description: `Civil Engineer Working is a full-stack application built with Express, React, and TypeScript, centered around a production-ready OTP-based email verification flow.

The app sends verification codes via Resend, with Brevo SMTP configured as an automatic fallback so verification emails reliably reach users even if the primary provider has an outage. Unverified users are gated from logging in until they complete email verification, protecting the integrity of accounts on the platform.

While building this project, I diagnosed and fixed a Prisma connection-pool exhaustion bug that was causing intermittent request failures under load — tracing it to un-released client instances and correcting the connection lifecycle.`,
      coverImageUrl: IMG.civilEngineer,
      category: ProjectCategory.CIVIL_ENGINEERING,
      featured: true,
      liveUrl: "#",
      githubUrl: "#",
      technologies: ["React", "Node.js", "Express", "TypeScript", "PostgreSQL"],
      keyFeatures: [
        "Production-ready OTP-based email verification (Resend + Brevo SMTP fallback)",
        "Login gating for unverified users",
        "Diagnosed and fixed a Prisma connection-pool exhaustion bug",
        "TypeScript across frontend and backend for type safety",
      ],
      techStackDetail: {
        Frontend: "React, TypeScript",
        Backend: "Node.js, Express, TypeScript",
        Database: "PostgreSQL (Prisma ORM)",
        Email: "Resend, Brevo SMTP fallback",
      },
      order: 1,
    },
  });

  await prisma.project.create({
    data: {
      slug: "taskflow",
      title: "Taskflow",
      summary: "Full-stack task manager with JWT auth and a beginner-friendly codebase.",
      description: `Taskflow is a full-stack task management application built with React on the frontend and Node.js/Express with MongoDB (via Mongoose) on the backend. Authentication is handled with JWT.

The codebase is intentionally written to be beginner-friendly, with clear structure and thorough comments, making it useful both as a working task manager and as a reference project for people learning full-stack development.`,
      coverImageUrl: IMG.taskflow,
      category: ProjectCategory.WEB,
      featured: true,
      liveUrl: "#",
      githubUrl: "#",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
      keyFeatures: [
        "Create, update, complete, and delete tasks",
        "JWT-based authentication",
        "Beginner-friendly, well-commented codebase",
        "MongoDB/Mongoose data layer",
      ],
      techStackDetail: {
        Frontend: "React",
        Backend: "Node.js, Express.js",
        Database: "MongoDB (Mongoose)",
        Auth: "JWT",
      },
      order: 2,
    },
  });

  await prisma.project.create({
    data: {
      slug: "url-shortener",
      title: "URL Shortener",
      summary: "Organizes document links under memorable names, accessible from anywhere.",
      description: `A URL shortener that goes beyond generic short links — it organizes important document links under memorable, human-friendly names so they can be recalled and shared from anywhere without hunting through folders or chat history.

Built to solve a real personal workflow problem: keeping frequently-used document links (forms, reports, references) accessible via a short, memorable name instead of a long URL.`,
      coverImageUrl: IMG.urlShortener,
      category: ProjectCategory.WEB,
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      technologies: ["React", "Node.js", "PostgreSQL"],
      keyFeatures: [
        "Assign memorable names to document links",
        "Fast redirect lookup",
        "Simple, minimal interface",
      ],
      techStackDetail: {
        Frontend: "React",
        Backend: "Node.js, Express.js",
        Database: "PostgreSQL",
      },
      order: 3,
    },
  });

  // ---------------- Experience (placeholder — admin to finalize) ----------------
  await prisma.experienceEntry.deleteMany();
  await prisma.experienceEntry.createMany({
    data: [
      {
        role: "Full Stack Developer",
        company: "Freelance / Personal Projects",
        startLabel: "2026",
        endLabel: "Present",
        bullets: [
          "Building Territory Run and other production-grade web applications using React, Node.js, and PostgreSQL.",
          "Applying engineering-grade rigor to system architecture and data modeling.",
        ],
        icon: "briefcase",
        colorToken: "purple",
        order: 0,
      },
      {
        role: "ML Pipeline Intern",
        company: "Under Prof. N.K. Tiwari",
        startLabel: "2025",
        endLabel: "2025",
        bullets: [
          "Built a machine learning pipeline to predict air entrainment ratio.",
          "Placeholder entry — to be corrected/finalized via the admin portal.",
        ],
        icon: "cpu",
        colorToken: "blue",
        order: 1,
      },
      {
        role: "Civil Engineering Intern",
        company: "HUDCO",
        startLabel: "2024",
        endLabel: "2024",
        bullets: [
          "Worked with ArcGIS and eQuest on planning and energy-analysis tasks.",
          "Placeholder entry — to be corrected/finalized via the admin portal.",
        ],
        icon: "tool",
        colorToken: "cyan",
        order: 2,
      },
    ],
  });

  // ---------------- Education ----------------
  await prisma.educationEntry.deleteMany();
  await prisma.educationEntry.createMany({
    data: [
      {
        title: "B.Tech Civil Engineering",
        institution: "NIT Kurukshetra",
        startLabel: "2022",
        endLabel: "2026",
        description:
          "Core coursework in structural analysis, geotechnical and hydraulic engineering, surveying, and GIS — the analytical foundation I now bring into software engineering.",
        featured: false,
        order: 0,
      },
      {
        title: "Geotechnical & Hydraulic Canal-Slope Design Report",
        institution: "SYL–BML Parallel Canals, Jyotisar",
        startLabel: "2026",
        endLabel: "2026",
        description:
          "Featured academic project: a geotechnical and hydraulic report on canal-slope stability for the SYL–BML parallel canals near Jyotisar, covering slope stability analysis and hydraulic design considerations.",
        featured: true,
        coverImageUrl: IMG.canalReport,
        order: 1,
      },
      {
        title: "Digital ArcGIS Map of NIT Kurukshetra",
        institution: "NIT Kurukshetra",
        startLabel: "2022",
        endLabel: "2022",
        description: "Produced a digital ArcGIS map of the NIT Kurukshetra campus.",
        featured: false,
        order: 2,
      },
      {
        title: "3D STAAD.Pro Structural Design",
        institution: "NIT Kurukshetra",
        startLabel: "2023",
        endLabel: "2023",
        description: "3D structural design and analysis coursework project using STAAD.Pro.",
        featured: false,
        order: 3,
      },
    ],
  });

  // ---------------- Blog posts ----------------
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({
    data: [
      {
        slug: "how-i-built-ride-share",
        title: "How I Built a Ride Sharing Platform",
        excerpt:
          "A look at building ride_share — domain-restricted signup, OTP verification, and real-time chat for NIT Kurukshetra students.",
        content:
          "<p>Building ride_share meant solving a trust problem before a technical one: how do you let students share rides with strangers safely? Domain-restricted signup and OTP verification were the answer.</p><p>This post walks through the architecture, the Socket.IO real-time chat layer, and the lessons learned along the way.</p>",
        coverImageUrl: IMG.blogGeneric,
        readTimeLabel: "5 min read",
        published: true,
      },
      {
        slug: "civil-engineering-tools-every-builder-should-know",
        title: "Civil Engineering Tools Every Builder Should Know",
        excerpt: "ArcGIS, STAAD.Pro, and eQuest — the tools behind the analysis, explained simply.",
        content:
          "<p>Before I wrote a line of production code, I was drawing slope-stability diagrams in ArcGIS and running structural models in STAAD.Pro. Here's what those tools do and why the discipline behind them still shapes how I build software today.</p>",
        coverImageUrl: IMG.blogGeneric,
        readTimeLabel: "5 min read",
        published: true,
      },
      {
        slug: "engineer-turned-developer",
        title: "Engineer Turned Developer: Why the Combination Works",
        excerpt: "Bringing standards-driven engineering rigor into production software.",
        content:
          "<p>Civil engineering trains you to reason about failure modes before they happen. That mindset — tolerances, safety margins, standards compliance — turns out to translate directly into writing more reliable software.</p>",
        coverImageUrl: IMG.blogGeneric,
        readTimeLabel: "4 min read",
        published: true,
      },
    ],
  });

  // ---------------- Hobbies (dynamic field builder demo data) ----------------
  await prisma.hobbyEntryValue.deleteMany();
  await prisma.hobbyEntry.deleteMany();
  await prisma.hobbyField.deleteMany();
  await prisma.hobbySubcollection.deleteMany();
  await prisma.hobbyCard.deleteMany();

  // Photography -> Gallery
  const photography = await prisma.hobbyCard.create({
    data: {
      slug: "photography",
      title: "Photography",
      coverImageUrl: IMG.photography,
      description: "Landscapes and street photography from campus and travels.",
      order: 0,
    },
  });
  const gallery = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: photography.id, slug: "gallery", title: "Gallery", order: 0 },
  });
  const galleryImageField = await prisma.hobbyField.create({
    data: {
      subcollectionId: gallery.id,
      key: "image",
      label: "Photo",
      inputType: FieldInputType.IMAGE,
      required: true,
      order: 0,
    },
  });
  const galleryCaptionField = await prisma.hobbyField.create({
    data: {
      subcollectionId: gallery.id,
      key: "caption",
      label: "Caption",
      inputType: FieldInputType.TEXT,
      required: false,
      order: 1,
    },
  });
  const galleryEntry = await prisma.hobbyEntry.create({
    data: { subcollectionId: gallery.id, order: 0 },
  });
  await prisma.hobbyEntryValue.createMany({
    data: [
      { entryId: galleryEntry.id, fieldId: galleryImageField.id, value: IMG.photography },
      { entryId: galleryEntry.id, fieldId: galleryCaptionField.id, value: "NIT Kurukshetra campus at dusk" },
    ],
  });

  // Book Reading -> Read / Currently Reading / Wishlist
  const books = await prisma.hobbyCard.create({
    data: {
      slug: "book-reading",
      title: "Book Reading",
      coverImageUrl: IMG.books,
      description: "Mostly engineering, systems design, and sci-fi.",
      order: 1,
    },
  });

  const read = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: books.id, slug: "read", title: "Read", order: 0 },
  });
  const readCover = await prisma.hobbyField.create({
    data: { subcollectionId: read.id, key: "cover_image", label: "Cover", inputType: FieldInputType.IMAGE, required: true, order: 0 },
  });
  const readTitle = await prisma.hobbyField.create({
    data: { subcollectionId: read.id, key: "title", label: "Title", inputType: FieldInputType.TEXT, required: true, order: 1 },
  });
  const readReview = await prisma.hobbyField.create({
    data: { subcollectionId: read.id, key: "review", label: "Review", inputType: FieldInputType.TEXTAREA, required: true, order: 2 },
  });
  const readRating = await prisma.hobbyField.create({
    data: { subcollectionId: read.id, key: "rating", label: "Rating", inputType: FieldInputType.RATING, required: true, order: 3 },
  });
  const readEntry = await prisma.hobbyEntry.create({ data: { subcollectionId: read.id, order: 0 } });
  await prisma.hobbyEntryValue.createMany({
    data: [
      { entryId: readEntry.id, fieldId: readCover.id, value: IMG.books },
      { entryId: readEntry.id, fieldId: readTitle.id, value: "Designing Data-Intensive Applications" },
      { entryId: readEntry.id, fieldId: readReview.id, value: "Reshaped how I think about backend systems." },
      { entryId: readEntry.id, fieldId: readRating.id, value: "5" },
    ],
  });

  const currentlyReading = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: books.id, slug: "currently-reading", title: "Currently Reading", order: 1 },
  });
  const crTitle = await prisma.hobbyField.create({
    data: { subcollectionId: currentlyReading.id, key: "title", label: "Title", inputType: FieldInputType.TEXT, required: true, order: 0 },
  });
  const crCover = await prisma.hobbyField.create({
    data: { subcollectionId: currentlyReading.id, key: "cover_image", label: "Cover", inputType: FieldInputType.IMAGE, required: false, order: 1 },
  });
  const crEntry = await prisma.hobbyEntry.create({ data: { subcollectionId: currentlyReading.id, order: 0 } });
  await prisma.hobbyEntryValue.createMany({
    data: [
      { entryId: crEntry.id, fieldId: crTitle.id, value: "The Pragmatic Programmer" },
      { entryId: crEntry.id, fieldId: crCover.id, value: IMG.books },
    ],
  });

  const wishlist = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: books.id, slug: "wishlist", title: "Wishlist", order: 2 },
  });
  const wishTitle = await prisma.hobbyField.create({
    data: { subcollectionId: wishlist.id, key: "title", label: "Title", inputType: FieldInputType.TEXT, required: true, order: 0 },
  });
  const wishEntry = await prisma.hobbyEntry.create({ data: { subcollectionId: wishlist.id, order: 0 } });
  await prisma.hobbyEntryValue.create({
    data: { entryId: wishEntry.id, fieldId: wishTitle.id, value: "Clean Architecture" },
  });

  // PC Games -> Played / Wishlist
  const games = await prisma.hobbyCard.create({
    data: {
      slug: "pc-games",
      title: "PC Games",
      coverImageUrl: IMG.games,
      description: "Strategy and open-world games, when there's time.",
      order: 2,
    },
  });
  const played = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: games.id, slug: "played", title: "Played", order: 0 },
  });
  const playedTitle = await prisma.hobbyField.create({
    data: { subcollectionId: played.id, key: "title", label: "Title", inputType: FieldInputType.TEXT, required: true, order: 0 },
  });
  const playedCover = await prisma.hobbyField.create({
    data: { subcollectionId: played.id, key: "cover_image", label: "Cover", inputType: FieldInputType.IMAGE, required: false, order: 1 },
  });
  const playedRating = await prisma.hobbyField.create({
    data: { subcollectionId: played.id, key: "rating", label: "Rating", inputType: FieldInputType.RATING, required: false, order: 2 },
  });
  const playedEntry = await prisma.hobbyEntry.create({ data: { subcollectionId: played.id, order: 0 } });
  await prisma.hobbyEntryValue.createMany({
    data: [
      { entryId: playedEntry.id, fieldId: playedTitle.id, value: "Age of Empires IV" },
      { entryId: playedEntry.id, fieldId: playedCover.id, value: IMG.games },
      { entryId: playedEntry.id, fieldId: playedRating.id, value: "4" },
    ],
  });

  const gameWishlist = await prisma.hobbySubcollection.create({
    data: { hobbyCardId: games.id, slug: "wishlist", title: "Wishlist", order: 1 },
  });
  const gwTitle = await prisma.hobbyField.create({
    data: { subcollectionId: gameWishlist.id, key: "title", label: "Title", inputType: FieldInputType.TEXT, required: true, order: 0 },
  });
  const gwEntry = await prisma.hobbyEntry.create({ data: { subcollectionId: gameWishlist.id, order: 0 } });
  await prisma.hobbyEntryValue.create({
    data: { entryId: gwEntry.id, fieldId: gwTitle.id, value: "Cities: Skylines II" },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
