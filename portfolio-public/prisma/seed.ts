import { PrismaClient, EducationStatus, TechCategory, HobbyFieldType, StatContext } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ── Profile ────────────────────────────────────────────────────────
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: "Ankit Kumar",
      roles: ["Full Stack Developer", "Android Developer", "Civil Engineer"],
      tagline: "I build beautiful, functional and user-centric digital experiences that solve real-world problems.",
      profileImageUrl: null,
      resumeUrl: null,
      email: "ankitkumar.dev@gmail.com",
      phone: "+91 98765 43210",
      education: "B.Tech Civil Engineering",
      location: "Kurukshetra, Haryana, India",
      languages: "English, Hindi",
      availabilityStatus: "Open for Freelance & Full-time Opportunities",
      bookingLink: null,
      mapLatitude: 30.129496,
      mapLongitude: 77.308176,
      mapLocationText: "Kurukshetra, Haryana, India 136118",
      aboutHeadlinePrefix: "Civil Engineer by ",
      aboutHeadlineWord1: "degree",
      aboutHeadlineMiddle: ", Developer by ",
      aboutHeadlineWord2: "passion",
      aboutIntro: "I'm a Full Stack Developer, Android Developer and Civil Engineer with a passion for building digital solutions that make an impact.",
      positioningCopy: "Trained as a civil engineer, I bring the same analytical, standards-driven rigor to production software — measuring twice, shipping once, and treating reliability as a first-class requirement rather than an afterthought.",
      footerTagline: "Full Stack Developer, Android Developer and Civil Engineer.",
    },
  });

  // ── Socials ───────────────────────────────────────────────────────
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "github", url: "https://github.com/", icon: "FaGithub", order: 0 },
      { platform: "linkedin", url: "https://linkedin.com/", icon: "FaLinkedin", order: 1 },
      { platform: "twitter", url: "https://twitter.com/", icon: "FaTwitter", order: 2 },
      { platform: "instagram", url: "https://instagram.com/", icon: "FaInstagram", order: 3 },
    ],
  });

  // ── Footer quick links / services ────────────────────────────────
  await prisma.quickLink.deleteMany();
  await prisma.quickLink.createMany({
    data: [
      { label: "Home", href: "/", order: 0, section: "quick" },
      { label: "About", href: "/about", order: 1, section: "quick" },
      { label: "Projects", href: "/projects", order: 2, section: "quick" },
      { label: "Experience", href: "/experience", order: 3, section: "quick" },
      { label: "Education", href: "/education", order: 4, section: "quick" },
      { label: "Blog", href: "/blogs", order: 5, section: "quick" },
      { label: "Contact", href: "/contact", order: 6, section: "quick" },
      { label: "Web Development", href: "/", order: 0, section: "services" },
      { label: "Android Development", href: "/", order: 1, section: "services" },
      { label: "UI/UX Design", href: "/", order: 2, section: "services" },
      { label: "Backend Development", href: "/", order: 3, section: "services" },
      { label: "Database Design", href: "/", order: 4, section: "services" },
    ],
  });

  // ── Stats ─────────────────────────────────────────────────────────
  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { context: StatContext.HOME, label: "Projects Completed", value: "50+", icon: "MdArticle", order: 0 },
      { context: StatContext.HOME, label: "Technologies", value: "20+", icon: "MdBuild", order: 1 },
      { context: StatContext.HOME, label: "Years Experience", value: "2+", icon: "MdCalendarToday", order: 2 },
      { context: StatContext.HOME, label: "Major Certifications", value: "10+", icon: "MdVerified", order: 3 },
      { context: StatContext.HOME, label: "Dedication", value: "100%", icon: "MdEmojiEvents", order: 4 },

      { context: StatContext.ABOUT, label: "Years Experience", value: "2+", icon: "MdCalendarToday", order: 0 },
      { context: StatContext.ABOUT, label: "Projects", value: "50+", icon: "MdArticle", order: 1 },
      { context: StatContext.ABOUT, label: "Technologies", value: "20+", icon: "MdBuild", order: 2 },
      { context: StatContext.ABOUT, label: "Certificates", value: "15+", icon: "MdVerified", order: 3 },

      { context: StatContext.EXPERIENCE, label: "Years Experience", value: "2+", icon: "FaBriefcase", order: 0 },
      { context: StatContext.EXPERIENCE, label: "Projects Completed", value: "50+", icon: "MdArticle", order: 1 },
      { context: StatContext.EXPERIENCE, label: "Technologies", value: "20+", icon: "MdBuild", order: 2 },
      { context: StatContext.EXPERIENCE, label: "Happy Clients", value: "15+", icon: "FaUserTie", order: 3 },
      { context: StatContext.EXPERIENCE, label: "Certifications", value: "10+", icon: "MdVerified", order: 4 },
    ],
  });

  // ── Services ─────────────────────────────────────────────────────
  await prisma.serviceItem.deleteMany();
  await prisma.serviceItem.createMany({
    data: [
      { title: "Web Development", description: "Modern websites with great UI/UX", icon: "MdWeb", order: 0 },
      { title: "Android Development", description: "High performance Android apps", icon: "MdSmartphone", order: 1 },
      { title: "UI/UX Design", description: "Beautiful and intuitive designs", icon: "MdDesignServices", order: 2 },
      { title: "Backend Development", description: "Scalable and secure backend", icon: "MdStorage", order: 3 },
      { title: "Database Design", description: "Optimized and reliable databases", icon: "MdStorage", order: 4 },
      { title: "Civil Engineering Solutions", description: "Estimation, designing and analysis", icon: "MdEngineering", order: 5 },
    ],
  });

  // ── Technologies (shared by tech stack grid + project chips) ──────
  await prisma.technology.deleteMany();
  const techData: { name: string; icon: string; category: TechCategory; order: number }[] = [
    { name: "Kotlin", icon: "SiKotlin", category: TechCategory.LANGUAGES, order: 0 },
    { name: "JavaScript", icon: "SiJavascript", category: TechCategory.LANGUAGES, order: 1 },
    { name: "TypeScript", icon: "SiTypescript", category: TechCategory.LANGUAGES, order: 2 },
    { name: "C", icon: "SiC", category: TechCategory.LANGUAGES, order: 3 },
    { name: "Python", icon: "FaPython", category: TechCategory.LANGUAGES, order: 4 },
    { name: "Java", icon: "FaJava", category: TechCategory.LANGUAGES, order: 5 },

    { name: "React", icon: "FaReact", category: TechCategory.FRONTEND, order: 0 },
    { name: "Next.js", icon: "SiNextdotjs", category: TechCategory.FRONTEND, order: 1 },
    { name: "Vite", icon: "SiVite", category: TechCategory.FRONTEND, order: 2 },
    { name: "HTML5", icon: "FaHtml5", category: TechCategory.FRONTEND, order: 3 },
    { name: "CSS3", icon: "FaCss3Alt", category: TechCategory.FRONTEND, order: 4 },

    { name: "Node.js", icon: "FaNodeJs", category: TechCategory.BACKEND, order: 0 },
    { name: "Express", icon: "SiExpress", category: TechCategory.BACKEND, order: 1 },
    { name: "Firebase", icon: "SiFirebase", category: TechCategory.BACKEND, order: 2 },

    { name: "PostgreSQL", icon: "SiPostgresql", category: TechCategory.DATABASE, order: 0 },
    { name: "MongoDB", icon: "SiMongodb", category: TechCategory.DATABASE, order: 1 },
    { name: "MySQL", icon: "SiMysql", category: TechCategory.DATABASE, order: 2 },

    { name: "Prisma", icon: "SiPrisma", category: TechCategory.TOOLS, order: 0 },
    { name: "Git", icon: "FaGitAlt", category: TechCategory.TOOLS, order: 1 },
    { name: "Figma", icon: "FaFigma", category: TechCategory.TOOLS, order: 2 },

    { name: "Android (Jetpack Compose)", icon: "FaAndroid", category: TechCategory.MOBILE, order: 0 },
    { name: "Kotlin Mobile", icon: "SiKotlin", category: TechCategory.MOBILE, order: 1 },
    { name: "Flutter", icon: "SiFlutter", category: TechCategory.MOBILE, order: 2 },

    { name: "Cloudinary", icon: "SiCloudinary", category: TechCategory.OTHER, order: 0 },
    { name: "Linux", icon: "FaLinux", category: TechCategory.OTHER, order: 1 },
    { name: "Vercel", icon: "SiVercel", category: TechCategory.OTHER, order: 2 },
    { name: "Render", icon: "SiRender", category: TechCategory.OTHER, order: 3 },
  ];
  await prisma.technology.createMany({ data: techData });
  const tech = Object.fromEntries((await prisma.technology.findMany()).map((t) => [t.name, t.id]));

  // ── Project categories (admin-managed, seed with a starter set) ──
  await prisma.projectCategory.deleteMany();
  await prisma.projectCategory.createMany({
    data: [
      { name: "Web", slug: "web", order: 0 },
      { name: "Android", slug: "android", order: 1 },
      { name: "Civil Engineering", slug: "civil-engineering", order: 2 },
      { name: "UI/UX", slug: "ui-ux", order: 3 },
    ],
  });
  const cat = Object.fromEntries((await prisma.projectCategory.findMany()).map((c) => [c.slug, c.id]));

  // ── Projects ───────────────────────────────────────────────────────
  await prisma.project.deleteMany();

  const rideShare = await prisma.project.create({
    data: {
      title: "ride_share",
      slug: "ride-share",
      summary: "Ride-sharing app for NIT Kurukshetra students.",
      description:
        "ride_share is a ride-sharing platform built for NIT Kurukshetra students. Signup is domain-restricted so only verified students can see rides and contact each other. The platform uses OTP verification, Socket.IO for real-time chat between drivers and passengers, a React + Vite frontend, and a Node/Express backend.\n\nUsers can create an account, verify their identity, publish ride details, browse available rides, send ride requests, and receive instant notifications about ride status. An integrated chat system lets drivers and passengers communicate before and during the trip.\n\nAn admin dashboard enables administrators to manage users, monitor rides, review reports, moderate content, and analyze platform performance.",
      coverImageUrl: null,
      liveDemoUrl: "#",
      githubUrl: "#",
      featured: true,
      order: 0,
      categoryId: cat["web"],
      features: {
        create: [
          { text: "Domain-restricted signup — only verified NIT Kurukshetra students can join", order: 0 },
          { text: "OTP-based email verification before login is permitted", order: 1 },
          { text: "Create, edit, and manage ride listings", order: 2 },
          { text: "Search rides based on source, destination, date, and time", order: 3 },
          { text: "Send, accept, or reject ride requests", order: 4 },
          { text: "Real-time chat between drivers and passengers via Socket.IO", order: 5 },
          { text: "Live notifications for ride updates", order: 6 },
          { text: "Responsive design for web and mobile devices", order: 7 },
          { text: "Admin dashboard for user, ride, and platform management", order: 8 },
        ],
      },
      technologies: {
        create: [
          { technologyId: tech["React"], order: 0 },
          { technologyId: tech["Vite"], order: 1 },
          { technologyId: tech["Node.js"], order: 2 },
          { technologyId: tech["Express"], order: 3 },
          { technologyId: tech["PostgreSQL"], order: 4 },
          { technologyId: tech["Prisma"], order: 5 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Civil Engineer Working",
      slug: "civil-engineer-working",
      summary: "Full-stack Express/React/TypeScript app for civil engineering workflows.",
      description:
        "A full-stack Express/React/TypeScript application built for civil engineering workflows, with production-ready OTP-based email verification through Resend with an SMTP fallback, and login gating so unverified users can't access protected areas. Development included tracking down and fixing a Prisma connection-pool bug that was exhausting connections under load.",
      coverImageUrl: null,
      liveDemoUrl: "#",
      githubUrl: "#",
      featured: true,
      order: 1,
      categoryId: cat["civil-engineering"],
      features: {
        create: [
          { text: "Production-ready OTP-based email verification (Resend + SMTP fallback)", order: 0 },
          { text: "Login gating for unverified users", order: 1 },
          { text: "Fixed a Prisma connection-pool exhaustion bug", order: 2 },
        ],
      },
      technologies: {
        create: [
          { technologyId: tech["React"], order: 0 },
          { technologyId: tech["TypeScript"], order: 1 },
          { technologyId: tech["Express"], order: 2 },
          { technologyId: tech["PostgreSQL"], order: 3 },
          { technologyId: tech["Prisma"], order: 4 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "Taskflow",
      slug: "taskflow",
      summary: "Full-stack task manager with JWT auth.",
      description:
        "Taskflow is a full-stack task management app built with React on the frontend and Node/Express with MongoDB and Mongoose on the backend. Authentication is handled with JWT, and users can create, assign, and track tasks through their lifecycle.",
      coverImageUrl: null,
      liveDemoUrl: "#",
      githubUrl: "#",
      featured: true,
      order: 2,
      categoryId: cat["web"],
      features: {
        create: [
          { text: "JWT-based authentication", order: 0 },
          { text: "Create, assign, and track tasks", order: 1 },
          { text: "MongoDB/Mongoose data layer", order: 2 },
        ],
      },
      technologies: {
        create: [
          { technologyId: tech["React"], order: 0 },
          { technologyId: tech["Node.js"], order: 1 },
          { technologyId: tech["Express"], order: 2 },
          { technologyId: tech["MongoDB"], order: 3 },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      title: "URL Shortener",
      slug: "url-shortener",
      summary: "Organizes document links under memorable names.",
      description:
        "A URL shortener that organizes document links under memorable names, accessible from anywhere by that name — useful for sharing long, hard-to-remember document URLs with a clean, short alias.",
      coverImageUrl: null,
      liveDemoUrl: "#",
      githubUrl: "#",
      featured: true,
      order: 3,
      categoryId: cat["web"],
      features: {
        create: [
          { text: "Create short, memorable aliases for long document links", order: 0 },
          { text: "Access any link from anywhere by its alias", order: 1 },
        ],
      },
      technologies: {
        create: [
          { technologyId: tech["Node.js"], order: 0 },
          { technologyId: tech["Express"], order: 1 },
          { technologyId: tech["PostgreSQL"], order: 2 },
        ],
      },
    },
  });

  // ── Experience (placeholder — admin to finalize) ──────────────────
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({ data: [] }); // cleared, seed individually below for bullets

  const exp1 = await prisma.experience.create({
    data: { role: "Full Stack Developer", company: "Freelance", startDate: "2026", endDate: null, color: "#60a5fa", icon: "FaBriefcase", order: 0 },
  });
  await prisma.experienceBullet.createMany({
    data: [
      { experienceId: exp1.id, text: "Building modern web applications using React, Node.js, and PostgreSQL.", order: 0 },
      { experienceId: exp1.id, text: "Developing scalable solutions with clean architecture and best practices.", order: 1 },
    ],
  });

  const exp2 = await prisma.experience.create({
    data: { role: "Android Developer", company: "TechSolutions Pvt. Ltd. (placeholder)", startDate: "2025", endDate: "2026", color: "#a855f7", icon: "FaCode", order: 1 },
  });
  await prisma.experienceBullet.createMany({
    data: [
      { experienceId: exp2.id, text: "Developed Android applications using Kotlin and Jetpack Compose.", order: 0 },
      { experienceId: exp2.id, text: "Integrated REST APIs and optimized app performance.", order: 1 },
    ],
  });

  const exp3 = await prisma.experience.create({
    data: { role: "Web Developer Intern", company: "DigitalCraft Studios (placeholder)", startDate: "2024", endDate: "2025", color: "#818cf8", icon: "FaCode", order: 2 },
  });
  await prisma.experienceBullet.createMany({
    data: [
      { experienceId: exp3.id, text: "Built responsive websites and web applications using HTML, CSS, JavaScript, and React.", order: 0 },
      { experienceId: exp3.id, text: "Assisted in client projects and implemented UI/UX designs.", order: 1 },
    ],
  });

  // ── Education ───────────────────────────────────────────────────
  await prisma.educationEntry.deleteMany();
  await prisma.educationEntry.createMany({
    data: [
      {
        degree: "B.Tech Civil Engineering",
        institution: "NIT Kurukshetra",
        startDate: "2022",
        endDate: "2026",
        description: "Completed B.Tech in Civil Engineering with focus on Structural Engineering, Geotechnical, and Transportation.",
        status: EducationStatus.IN_PROGRESS,
        gpaOrPercentage: "CGPA: 7.8 / 10",
        order: 0,
      },
      {
        degree: "Senior Secondary (12th)",
        institution: "CBSE Board",
        startDate: "2020",
        endDate: "2022",
        description: "Completed Higher Secondary with Physics, Chemistry, and Mathematics.",
        status: EducationStatus.COMPLETED,
        gpaOrPercentage: "Percentage: 82.4%",
        order: 1,
      },
      {
        degree: "Secondary (10th)",
        institution: "CBSE Board",
        startDate: "2017",
        endDate: "2020",
        description: "Completed Secondary Education with distinction.",
        status: EducationStatus.COMPLETED,
        gpaOrPercentage: "Percentage: 86.6%",
        order: 2,
      },
    ],
  });

  await prisma.keySubject.deleteMany();
  await prisma.keySubject.createMany({
    data: [
      "Structural Analysis", "Geotechnical Engineering", "Transportation Engg.", "Concrete Technology",
      "Hydraulics", "Environmental Engg.", "Surveying", "Engineering Mechanics",
      "Construction Management", "Steel Structures",
    ].map((name, i) => ({ name, order: i })),
  });

  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: [
      { icon: "MdEmojiEvents", title: "Consistent Performer", description: "Maintained good academic record", order: 0 },
      { icon: "FaTrophy", title: "Top 10% in Department", description: "Recognized for academic excellence", order: 1 },
      { icon: "MdArticle", title: "Technical Paper Presentation", description: "Presented research in college symposium", order: 2 },
      { icon: "MdVerified", title: "NPTEL Certifications", description: "Completed multiple NPTEL courses", order: 3 },
      { icon: "MdSchool", title: "Workshop & Seminar Participant", description: "Active participant in technical events", order: 4 },
    ],
  });

  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({
    data: [
      { title: "Android Development", imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg", order: 0 },
      { title: "Full Stack Developer", imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg", order: 1 },
      { title: "Civil Engineer", imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg", order: 2 },
    ],
  });

  // ── Blog posts ─────────────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  const blog1 = await prisma.blogPost.create({
    data: {
      title: "How I Built a Ride Sharing Platform",
      slug: "how-i-built-a-ride-sharing-platform",
      coverImageUrl: null,
      excerpt: "Objectives, challenges, and how to use ride_share.",
      liveDemoUrl: "#",
      githubUrl: "#",
      contentHtml: `
        <h2>Objectives</h2>
        <p>The primary objective of ride_share is to provide a secure, efficient, and student-only system that connects drivers and passengers travelling similar routes around NIT Kurukshetra.</p>
        <h2>Challenges Faced During Development</h2>
        <p><strong>1. Domain-restricted authentication</strong> — restricting signup to verified student emails while keeping onboarding smooth.</p>
        <p><strong>2. Ride matching logic</strong> — designing efficient queries to match by source, destination, date, and time.</p>
        <p><strong>3. Real-time communication</strong> — building a low-latency chat feature with Socket.IO.</p>
        <h2>How to Use</h2>
        <ol>
          <li>Register with your college email</li>
          <li>Verify via OTP</li>
          <li>Complete your profile</li>
          <li>Create or search for a ride</li>
          <li>Send a ride request and chat with your match</li>
        </ol>
      `,
    },
  });
  await prisma.blogPostTag.createMany({
    data: [
      { blogPostId: blog1.id, label: "React", order: 0 },
      { blogPostId: blog1.id, label: "Node.js", order: 1 },
      { blogPostId: blog1.id, label: "PostgreSQL", order: 2 },
    ],
  });

  const blog2 = await prisma.blogPost.create({
    data: {
      title: "Civil Engineering Tools Every Builder Should Know",
      slug: "civil-engineering-tools-every-builder-should-know",
      coverImageUrl: null,
      excerpt: "A rundown of tools that bridge civil engineering and software.",
      contentHtml: `
        <p>A short survey of the software tools that make modern civil engineering practice faster and more accurate, from structural analysis packages to modern estimation dashboards.</p>
      `,
    },
  });
  await prisma.blogPostTag.createMany({
    data: [{ blogPostId: blog2.id, label: "Civil Engineering", order: 0 }],
  });

  // ── Hobbies (dynamic field builder) ───────────────────────────
  await prisma.hobby.deleteMany();

  const photography = await prisma.hobby.create({
    data: { name: "Photography", slug: "photography", coverImageUrl: null, order: 0 },
  });
  const gallery = await prisma.hobbySubCollection.create({
    data: { name: "Gallery", order: 0, hobbyId: photography.id },
  });
  const galleryFields = await Promise.all([
    prisma.hobbyField.create({ data: { name: "Photo", fieldType: HobbyFieldType.IMAGE, required: true, order: 0, subCollectionId: gallery.id } }),
    prisma.hobbyField.create({ data: { name: "Date", fieldType: HobbyFieldType.DATE, required: true, order: 1, subCollectionId: gallery.id } }),
    prisma.hobbyField.create({ data: { name: "Time", fieldType: HobbyFieldType.TIME, required: false, order: 2, subCollectionId: gallery.id } }),
    prisma.hobbyField.create({ data: { name: "Location", fieldType: HobbyFieldType.TEXT, required: true, order: 3, subCollectionId: gallery.id } }),
  ]);
  for (let i = 0; i < 6; i++) {
    const entry = await prisma.hobbyEntry.create({ data: { order: i, subCollectionId: gallery.id } });
    await prisma.hobbyEntryValue.createMany({
      data: [
        { entryId: entry.id, fieldId: galleryFields[0].id, value: "https://res.cloudinary.com/demo/image/upload/sample.jpg" },
        { entryId: entry.id, fieldId: galleryFields[1].id, value: "2020-12-06" },
        { entryId: entry.id, fieldId: galleryFields[2].id, value: "12:30 PM" },
        { entryId: entry.id, fieldId: galleryFields[3].id, value: "Delhi Zoo" },
      ],
    });
  }

  const books = await prisma.hobby.create({
    data: { name: "Book Reading", slug: "book-reading", coverImageUrl: null, order: 1 },
  });
  const readSub = await prisma.hobbySubCollection.create({ data: { name: "Read", order: 0, hobbyId: books.id } });
  const readFields = await Promise.all([
    prisma.hobbyField.create({ data: { name: "Cover", fieldType: HobbyFieldType.IMAGE, required: true, order: 0, subCollectionId: readSub.id } }),
    prisma.hobbyField.create({ data: { name: "Title", fieldType: HobbyFieldType.TEXT, required: true, order: 1, subCollectionId: readSub.id } }),
    prisma.hobbyField.create({ data: { name: "Description", fieldType: HobbyFieldType.TEXTAREA, required: true, order: 2, subCollectionId: readSub.id } }),
    prisma.hobbyField.create({ data: { name: "Rating", fieldType: HobbyFieldType.RATING, required: true, order: 3, subCollectionId: readSub.id } }),
    prisma.hobbyField.create({ data: { name: "Read More", fieldType: HobbyFieldType.URL, required: false, order: 4, subCollectionId: readSub.id } }),
    prisma.hobbyField.create({ data: { name: "Finished On", fieldType: HobbyFieldType.DATETIME, required: true, order: 5, subCollectionId: readSub.id } }),
  ]);
  const readBooks = [
    ["Sole Land", "A location-based strategy game where you explore the real world, claim territories, complete missions, and compete to become the ultimate land conqueror."],
    ["Battle to the Haven", "An action-strategy game where players capture territories, compete against rival teams, and dominate the map through real-world exploration."],
  ];
  for (let i = 0; i < readBooks.length; i++) {
    const entry = await prisma.hobbyEntry.create({ data: { order: i, subCollectionId: readSub.id } });
    await prisma.hobbyEntryValue.createMany({
      data: [
        { entryId: entry.id, fieldId: readFields[0].id, value: "https://res.cloudinary.com/demo/image/upload/sample.jpg" },
        { entryId: entry.id, fieldId: readFields[1].id, value: readBooks[i][0] },
        { entryId: entry.id, fieldId: readFields[2].id, value: readBooks[i][1] },
        { entryId: entry.id, fieldId: readFields[3].id, value: "5" },
        { entryId: entry.id, fieldId: readFields[4].id, value: "#" },
        { entryId: entry.id, fieldId: readFields[5].id, value: "2024-03-01" },
      ],
    });
  }

  const wishlistSub = await prisma.hobbySubCollection.create({ data: { name: "Future Reading", order: 2, hobbyId: books.id } });
  const wishlistTitleField = await prisma.hobbyField.create({
    data: { name: "Title", fieldType: HobbyFieldType.TEXT, required: true, order: 0, subCollectionId: wishlistSub.id },
  });
  for (const title of ["Secret Soldier", "Rich Dad and Poor Dad", "Become a Billionaire"]) {
    const entry = await prisma.hobbyEntry.create({ data: { subCollectionId: wishlistSub.id } });
    await prisma.hobbyEntryValue.create({ data: { entryId: entry.id, fieldId: wishlistTitleField.id, value: title } });
  }

  for (const [name, slug] of [["Travelling", "travelling"], ["Cycling", "cycling"], ["Music", "music"], ["PC Games", "pc-games"]]) {
    await prisma.hobby.create({ data: { name, slug, coverImageUrl: null, order: 2 } });
  }

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
