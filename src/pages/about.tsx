import { A } from "@solidjs/router";

export default function About() {
  return (
    <div class="bg-sky-50 dark:bg-black min-h-screen transition-colors duration-90">
      <section class="max-w-3xl mx-auto text-gray-700 dark:text-gray-100 p-8">
        <div class="border-l-4 border-sky-500 dark:border-sky-400 pl-3 mb-8">
          <h1 class="text-2xl font-bold mb-1 tracking-tight">About</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Last updated: 2025-12-08
          </p>
        </div>

        <section class="mb-12">
          <h2 class="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
            1. Introduction
          </h2>

          <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold">
                Young Hyun Chi / 지영현 / 池營賢 / 池营贤
              </h3>

              <p class="text-gray-600 dark:text-gray-400">
                Backend Software Engineer · Rust / Infrastructure / Data
                Pipelines / SolidJS
              </p>
            </div>

            <figure class="flex flex-col items-center sm:items-end text-sm text-gray-500 dark:text-gray-400">
              <a
                href="https://cyhdev-img.s3.us-west-1.amazonaws.com/images/05da63f0-0a8e-4d96-807f-280ded45a6d5.avif"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cyhdev-img.s3.us-west-1.amazonaws.com/thumbnails/05da63f0-0a8e-4d96-807f-280ded45a6d5.avif"
                  alt="Portrait"
                  class="h-28 w-28 rounded-full object-cover shadow-sm ring-2 ring-white/70 dark:ring-gray-800"
                  loading="lazy"
                />
              </a>
              <figcaption class="mt-1 text-xs text-gray-500 dark:text-gray-500 text-center sm:text-right max-w-[11rem]"></figcaption>
            </figure>
          </div>
          <div>
            <h3 class="font-bold mb-2">Contact</h3>
            <ul class="list-none space-y-2 text-sm">
              <li>
                <span class="w-20 inline-block font-medium text-gray-500">
                  Email:
                </span>
                <a
                  href="mailto:younghyun1@gmail.com"
                  class="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  younghyun1@gmail.com
                </a>
              </li>
              <li>
                <span class="w-20 inline-block font-medium text-gray-500">
                  GitHub:
                </span>
                <a
                  href="https://github.com/younghyun1"
                  class="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  github.com/younghyun1
                </a>
              </li>
              <li>
                <span class="w-20 inline-block font-medium text-gray-500">
                  LinkedIn:
                </span>
                <a
                  href="https://linkedin.com/in/younghyun-chi-a60b59a9"
                  class="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  linkedin.com/in/younghyun-chi-a60b59a9
                </a>
              </li>
            </ul>
          </div>
          <br></br>
          <div class="flex flex-wrap gap-2 mb-6">
            <img
              src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=orange"
              alt="Rust"
            />
            <img
              src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=white"
              alt="C"
            />
            <img
              src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"
              alt="TypeScript"
            />
            <img
              src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=green"
              alt="Python"
            />
            <img
              src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"
              alt="Java"
            />
            <img
              src="https://img.shields.io/badge/Axum-000000?style=for-the-badge&logo=rust&logoColor=orange"
              alt="Axum"
            />
            <img
              src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"
              alt="Spring Boot"
            />
            <img
              src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white"
              alt="Django"
            />
            <img
              src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"
              alt="PostgreSQL"
            />
            <img
              src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"
              alt="MySQL"
            />
            <img
              src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white"
              alt="AWS"
            />
            <img
              src="https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white"
              alt="Google Cloud"
            />
            <img
              src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"
              alt="Docker"
            />
            <img
              src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"
              alt="Kubernetes"
            />
            <img
              src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white"
              alt="NGINX"
            />
            <img
              src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black"
              alt="Linux"
            />
            <img
              src="https://img.shields.io/badge/Arch%20Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white"
              alt="Arch Linux"
            />
            <img
              src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"
              alt="Ubuntu"
            />
            <img
              src="https://img.shields.io/badge/Amazon%20Linux-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=FF9900"
              alt="Amazon Linux"
            />
            <img
              src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white"
              alt="Windows"
            />
            <img
              src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white"
              alt="macOS"
            />
            <img
              src="https://img.shields.io/badge/Protocol%20Buffers-3367D6?style=for-the-badge&logo=google&logoColor=white"
              alt="Protocol Buffers"
            />
            <img
              src="https://img.shields.io/badge/BACnet-004B87?style=for-the-badge&logo=home-assistant&logoColor=white"
              alt="BACnet"
            />
            <img
              src="https://img.shields.io/badge/Modbus-FFCC00?style=for-the-badge&logo=modin&logoColor=000000"
              alt="Modbus"
            />
            <img
              src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white"
              alt="WebSockets"
            />
          </div>
          <p class="mb-4 leading-relaxed">
            I am a backend-focused software engineer with experience shipping
            and operating services across industrial, consumer, and data-heavy
            analytics contexts. My most recent projects have involved building
            backends, pipelines, and infrastructure for a dashboard integrating
            input from thousands of environmental sensors for Samsung
            Construction and Trading and deploying it on AWS; deploying an LLM
            and scraper-based YouTube channel analyzer for a firm serving
            content creators on GCP; and building backends and data pipelines
            for a K-Pop group's fan app as well as Hyundai Motor Company's
            Hyundai, Kia, and Genesis car app for Android and iOS.
          </p>
          <p class="mb-4 leading-relaxed">
            I helped pioneer the use of Rust webservers in the Korean startup
            ecosystem; several colleagues whom I've helped picked up the
            language have since moved on to write Rust at other companies. I
            believe in building web services that leverage the actual
            performance of modern compute resources as well as innovations in
            programming languages and compilation infrastructures to create
            fast, secure, reliable systems.
          </p>
          <p class="mb-4 leading-relaxed">
            I am proud to have worked across diverse fields with a range of
            coworkers from many cultures and backgrounds. From 2016 to 2017, I
            served for 21 months near the North Korean border with the 2nd
            Infantry Division of the US Army, working with both US and Korean
            military personnel. During my studies, I also worked professionally
            in journalism, photography, and translation. I have also performed
            manual labor in warehouses and logistics centers. Since 2023, I have
            focused on backend engineering. As of late 2025, I am adjusting to
            life in Colorado after getting married.
          </p>
        </section>

        {/* 2) Professional Career */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            2. Developer Career
          </h2>

          <div class="space-y-8">
            {/* GenesisNest */}
            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">GenesisNest</h3>
                <span class="text-sm font-mono text-gray-500">
                  Seongnam, South Korea | Jan 2025 - Jul 2025
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Software Engineer
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Developed infrastructure management tools for in-house
                  services and a K‑Pop group official app. Became familiar with
                  the Spring Boot ecosystem.
                </li>
                <li>
                  Contracted on Hyundai Motor Company’s Hyundai/Kia/Genesis
                  official app backends, integrating into a large Java codebase.
                </li>
                <li>
                  Implemented new APIs and bugfixes, coordinating with vendors
                  for services used by tens of millions of users across Asia and
                  Europe.
                </li>
                <li>
                  Established data pipelines for their internationalization
                  work, writing several Rust and Python scripts to automate the
                  integration of translated content into the Hyundai database.
                  Coordinated with corporate DBAs dealing with very large
                  datasets connected to the company's factory systems.
                </li>
              </ul>
            </div>

            {/* pampam */}
            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">pampam Inc</h3>
                <span class="text-sm font-mono text-gray-500">
                  Seoul, South Korea | Nov 2024 - Dec 2024
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Contract Software Engineer
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Designed PostgreSQL schema and Rust backend for an AI-based
                  YouTube analytics platform, and led deployment efforts on AWS
                  and GCP.
                </li>
                <li>
                  Led large-scale data collection via YouTube API (tens of
                  millions of comments/users).
                </li>
                <li>
                  Applied LLMs and on‑server OSS models to engineer insights and
                  summaries.
                </li>
              </ul>
            </div>

            {/* EAN Technology */}
            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">EAN Technology Co. Ltd</h3>
                <span class="text-sm font-mono text-gray-500">
                  Seoul, South Korea | Aug 2023 - Aug 2024
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Backend Software Engineer (Lead)
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <b>Samsung C&T Digital Twin Project:</b> Decommissioned a
                  dysfunctional microservice architecture, replacing it with a
                  highly optimized Axum (Rust) monolith. Reduced monthly cloud
                  bills from ~$5,000 to ~$150.
                </li>
                <li>
                  Contributed ~30,000 LOC (~75% of code) and implemented 80
                  endpoints with complex domain logic.
                </li>
                <li>
                  Achieved zero runtime shutdowns and ~90% error handling
                  coverage over nine months of production uptime.
                </li>
                <li>
                  Integrated thousands of real-time physical sensors (BACnet,
                  Modbus) and on-prem servers at Samsung C&amp;T Headquarters.
                </li>
                <li>
                  Optimized PostgreSQL queries and schema, reducing P99 latency
                  to double-digit ms on constrained hardware (2 cores, 4GB RAM)
                  from several seconds on some unoptimized queries.
                </li>
                <li>
                  Implemented CI/CD utilizing GitHub Runners, AWS CodeDeploy,
                  and Docker. Utilized MUSL, static linking, and multistage
                  builds with 'scratch' images to produce ~20MB Docker images
                  for extra security and cold start efficiency.
                </li>
                <li>
                  Mentored coworkers in Rust acquisition, enabling them to
                  transition from Node.js/Java within two months.
                </li>
              </ul>
            </div>

            {/* Artifyc */}
            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">Artifyc Inc</h3>
                <span class="text-sm font-mono text-gray-500">
                  Austin, TX (Remote) | Aug 2022 - Mar 2023
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Intern Software Engineer
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Implemented a Discord bot in Python using Reddit API to scrape
                  and post art commission requests.
                </li>
                <li>
                  Developed serverless backend logic on AWS Lambda for global
                  monetary conversion and surcharge calculation.
                </li>
                <li>
                  Assisted with React frontend revisions and asset integration.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3) Non-IT Career */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            3. Non-IT Career
          </h2>

          <div class="space-y-6">
            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">
                  Korea Institute of Maritime Science and Technology
                </h3>
                <span class="text-sm font-mono text-gray-500">
                  Seoul, South Korea | Jun-Jul 2023, Aug 2024
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Translator/Interpreter
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Interpreted (English, Korean, Norwegian) for high-level
                  conferences involving the Norwegian Ambassador and Dongwon
                  Group chairman.
                </li>
                <li>
                  Entrusted with details of high-sensitivity state and business
                  transactions and discussions related to maritime research and
                  development.
                </li>
                <li>
                  Coached KIMST personnel and director for US Department of
                  Energy events.
                </li>
              </ul>
            </div>

            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">
                  <a
                    href="https://en.wikipedia.org/wiki/United_States_Army"
                    class="text-sky-700 dark:text-sky-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    US Army
                  </a>{" "}
                  (
                  <a
                    href="https://en.wikipedia.org/wiki/2nd_Infantry_Division_(United_States)"
                    class="text-sky-700 dark:text-sky-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2nd Infantry Division
                  </a>
                  ) /{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Republic_of_Korea_Army"
                    class="text-sky-700 dark:text-sky-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ROK Army
                  </a>
                </h3>
                <span class="text-sm font-mono text-gray-500">
                  <a
                    href="https://en.wikipedia.org/wiki/Dongducheon"
                    class="text-sky-700 dark:text-sky-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dongducheon
                  </a>
                  , South Korea | Mar 2016 - Dec 2017
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                <a
                  href="https://en.wikipedia.org/wiki/Korean_Augmentation_to_the_United_States_Army"
                  class="text-sky-700 dark:text-sky-300 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KATUSA
                </a>{" "}
                | Instructor | Sergeant
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Served as a liaison soldier and instructor. Educated and
                  administratively in-processed ~6,000 American and Korean
                  personnel.
                </li>
                <li>
                  Taught fitness, culture, history, and safety/prevention
                  courses.
                </li>
                <li>
                  Maintained operational readiness during the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/2017%E2%80%932018_North_Korea_crisis"
                    class="text-sky-700 dark:text-sky-300 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2017 crisis
                  </a>
                  ; led a team of thirteen.
                </li>
              </ul>
            </div>

            <div>
              <div class="flex flex-wrap justify-between items-baseline mb-1">
                <h3 class="text-lg font-bold">Coupang Inc</h3>
                <span class="text-sm font-mono text-gray-500">
                  South Korea | 2020 - 2022
                </span>
              </div>
              <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
                Loader
              </p>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  Intensive manual labor in logistics warehouses during night
                  shifts.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4) Academics */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            4. Academics
          </h2>

          <div class="mb-6">
            <div class="flex flex-wrap justify-between items-baseline mb-2">
              <h3 class="text-lg font-bold">Sungkyunkwan University</h3>
              <span class="text-sm font-mono text-gray-500">
                Suwon, South Korea | Mar 2015 - Aug 2023
              </span>
            </div>
            <p class="text-sm font-medium mb-2 text-sky-600 dark:text-sky-400">
              B. Eng in Software Engineering
            </p>
            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                Completed a comprehensive course blending computer science, web
                and embedded software engineering, and electronics engineering.
                Focused on logic, low-level languages, operating systems, and
                network engineering as well as software engineering practices.
              </p>
              <p>
                Sungkyunkwan University is the oldest university in Korea,
                founded in 1398 as the Kingdom of Joseon's state bureaucratic
                academy in the Confucian tradition. Since liberation, it has
                been one of the leading academic and historical institutions in
                Korea, and it has consistently ranked as a world top 100
                university since my attendance.
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-bold mb-2 text-md">Publications</h4>
            <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <b>
                  Korean Language NLP Model Based Emotional Analysis of Social
                  Media Communities
                </b>{" "}
                (IMCOM 2023, IEEE Xplore).
                <br />
                <span class="ml-5 block text-xs text-gray-500 mt-1">
                  Utilized KoBERT to perform sentiment analysis on social media
                  data during the early COVID pandemic. Awarded Bronze Prize in
                  Graduation Projects.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5) Volunteer work and interests */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            5. Volunteer work & Interests
          </h2>

          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="font-bold mb-3 text-lg">Personal Projects</h3>
              <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <b>oohid:</b> A CLI UUIDv4 generator in Rust. ~3x faster than
                  libuuid. Features duplicate checking and Python/JSON
                  formatting.
                </li>
                <li>
                  <b>impulsr:</b> LLM-based YouTube transcription and comment
                  collection tool for marketing summaries.
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-bold mb-3 text-lg">Volunteer Work</h3>
              <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>Taught English at a community center.</li>
                <li>Volunteered at a disabled people run thrift store.</li>
                <li>
                  Translated materials for a human rights law center concerning
                  West Papua and Sakartvelo.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6) Hobbies */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            6. Hobbies
          </h2>

          <div class="space-y-4">
            <div>
              <h3 class="font-bold inline mr-2">Photography</h3>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Amateur landscape and portrait photographer since 2010. ~30,000
                photographs archived.
              </span>
              <div class="mt-2">
                <A
                  href="/photographs"
                  class="inline-flex items-center text-sky-600 dark:text-sky-400 hover:underline font-medium"
                >
                  View Photography Portfolio &rarr;
                </A>
              </div>
            </div>

            <div>
              <h3 class="font-bold inline mr-2">Journalism</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Interested in security and human rights issues (West Papua,
                Ethiopia, Korean Peninsula). Former student journalist for the
                Sungkyun Times.
              </p>
            </div>
          </div>
        </section>

        {/* 7) Qualifications and Other Skills */}
        <section class="mb-12">
          <h2 class="text-xl font-bold mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            7. Qualifications and Other Skills
          </h2>

          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="font-bold mb-2">Qualifications & Awards</h3>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <b>TOEFL:</b> 117/120 (CEFR C2)
                </li>
                <li>
                  <b>IELTS:</b> 8.5/9.0 (CEFR C2)
                </li>
                <li>
                  <b>7th Place:</b> 2021 Capstone Design & Idea Hackathon
                </li>
                <li>
                  <b>3rd Place:</b> 2020 Fintech Hackathon (SNUST)
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-bold mb-2">Languages</h3>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>Korean (Native)</li>
                <li>English (C2)</li>
                <li>Rudimentary French, German, Spanish, Mandarin</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
