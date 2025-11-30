import { createEffect, Suspense } from "solid-js";

export default function About() {
  return (
    <section class="bg-sky-50 dark:bg-black text-gray-700 dark:text-gray-100 p-8 min-h-screen transition-colors duration-90">
      <h1 class="text-2xl font-bold mb-2">About</h1>

      <h2 class="text-xl font-semibold mt-2 mb-2">
        Chi Younghyun / 지영현 / 池營賢
      </h2>
      <h3 class="text-lg font-medium mb-4">Backend Software Engineer</h3>

      <div class="flex flex-wrap gap-2 mb-4">
        <img
          src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=orange"
          alt="Rust"
        />
        <img
          src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=white"
          alt="C"
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
          src="https://img.shields.io/badge/postgres-000000?style=for-the-badge&logo=postgresql&logoColor=blue"
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
          src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white"
          alt="GCS"
        />
        <img
          src="https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white"
          alt="Azure"
        />
        <img
          src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"
          alt="Docker"
        />
        <img
          src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white"
          alt="PyTorch"
        />
        <img
          src="https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white"
          alt="Arch Linux"
        />
        <img
          src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"
          alt="Ubuntu"
        />
        <img
          src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white"
          alt="Windows"
        />
        <img
          src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white"
          alt="macOS"
        />
      </div>

      <p class="mb-4">
        I am a backend-focused software engineer with experience shipping and
        operating services across industrial, consumer, and data-heavy analytics
        contexts. Most recently, I have been working with <b>Rust</b>,{" "}
        <b>Axum</b>, <b>PostgreSQL</b>, and <b>AWS</b> to build
        latency-sensitive systems, optimize infrastructure costs, and integrate
        a variety of upstream data sources and sensors into reliable, observable
        services.
      </p>

      <p class="mb-4">
        I graduated from <b>Sungkyunkwan University</b> with a B. Eng in
        Software Engineering.
      </p>

      <p class="mb-6">
        I care about clear, maintainable systems programming; predictable
        performance; and the ethics and working conditions of STEM workers
        everywhere. I try to write code and documentation that will be kind to
        the next maintainer—even if that maintainer is me in six months.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-2">Current status</h3>

      <p class="mb-4">
        I recently emigrated to the United States and am in the middle of a
        relocation and career break while I navigate fiscal and bureaucratic
        responsibilities, set up a new household in Colorado Springs, and wait
        for an employment permit. I am currently refraining from any work
        activity (including remote, freelance, and contracting) until federal
        authorization is granted.
      </p>
      <p class="mb-4">
        In the meantime, I am focusing on private projects—such as this site and
        a native GUI “Postman clone”—and continuing to learn, write, and stay
        engaged with the Rust and backend ecosystem.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-2">Background</h3>

      <ul class="mb-4 list-disc list-inside">
        <li>
          <b>
            Relocation &amp; career break (Jul 2025 – Oct 2025, Colorado
            Springs, CO):
          </b>{" "}
          Emigrated to the United States, managed fiscal and bureaucratic
          processes, got married, and set up a new household in Colorado.
          Focusing on private projects and learning while waiting for an
          employment authorization document; not engaged in paid work during
          this period.
        </li>
        <li>
          <b>GenesisNest (Jan 2025 – Jul 2025, Seongnam, South Korea):</b>{" "}
          Software engineer working on infrastructure management tools for
          in-house services and a K‑Pop group official app (AWS EC2/ECS, load
          balancers, Slack bots, Rust), and contracting on Hyundai Motor
          Company’s Hyundai/Kia/Genesis official app backends. Integrated into a
          large Java codebase and data pipelines, implemented new APIs and
          bugfixes, and coordinated with vendors and other teams for services
          used by tens of millions of users across Asia and Europe.
        </li>
        <li>
          <b>pampam Inc (Nov 2024 – Dec 2024, Seoul, South Korea):</b> Contract
          software engineer responsible for PostgreSQL schema design, Rust
          backend, and AWS deployment of an AI (LLM) based YouTube video and
          creator analytics platform. Led large-scale data collection via the
          YouTube API (tens of millions of comments/users) and applied LLMs and
          on‑server OSS models to summarize and engineer insights.
        </li>
        <li>
          <b>EAN Technology (Sep 2023 – Sep 2024, Seoul, South Korea):</b>{" "}
          Backend lead for Samsung C&amp;T Digital Twin and AI Energy
          Management. Replaced a fragile Express/microservice stack with an Axum
          (Rust) monolith, cutting monthly cloud spend from ~USD 5,000 to ~USD
          150, and implemented ~80 REST endpoints with high test and
          error‑handling coverage. Integrated thousands of on‑prem sensors
          (BACnet, Modbus), tuned performance on constrained hosts, built CI/CD,
          and coordinated with UE4 frontend and cross‑functional stakeholders.
          Also led backend for AI Energy Management (tokio‑postgres, raw SQL,
          greenfield schema), mentoring engineers moving from Node/Java to Rust.
        </li>
        <li>
          <b>Earlier work:</b> Short Rust/LLM contracts, translation and
          interpretation (including high‑level government and diplomatic
          settings), and instruction roles—most notably as an instructor
          attached to US Forces Korea, training thousands of personnel in
          fitness, culture, and soldiering skills.
        </li>
        <li>
          <b>Education:</b> B. Eng in Software Engineering, Sungkyunkwan
          University, Republic of Korea.
        </li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Technology &amp; skills</h3>
      <ul class="mb-4 list-disc list-inside">
        <li>
          <b>Programming:</b> Rust, C, C++, Java, Python, JavaScript/TypeScript,
          x86 assembly when necessary.
        </li>
        <li>
          <b>Backend &amp; data:</b> Axum, Express, Spring; PostgreSQL, MySQL,
          MariaDB, SQLite, Redis, and the occasional in-RAM lookup table.
        </li>
        <li>
          <b>Cloud &amp; infra:</b> AWS, Azure, GCP, Oracle Cloud, Naver Cloud;
          Docker; CI/CD with GitHub Actions and assorted provider tooling.
        </li>
        <li>
          <b>Languages:</b> Korean (native), English (C2), with rudimentary
          French, German, Spanish, and Mandarin.
        </li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Interests</h3>

      <ul class="mb-4 list-disc list-inside">
        <li>High-throughput webservers and low-latency APIs</li>

        <li>Cache hierarchy and practical performance tuning</li>

        <li>
          <b>Effective concurrency through asynchrony and parallelism</b>
        </li>

        <li>
          <b>On-prem and hybrid infrastructure</b>
        </li>

        <li>Cloud infrastructure and cost optimization</li>

        <li>CI/CD, deployment pipelines, and release engineering</li>

        <li>CLI tooling and automation</li>

        <li>Operating systems and compilers</li>

        <li>Construction and electrical engineering</li>
        <li>Video game modding and technical art</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Studying</h3>

      <ul class="mb-4 list-disc list-inside">
        <li>Performance optimization in Rust applications</li>

        <li>Electrical and HVAC systems (for built-environment use cases)</li>

        <li>Native GUI development and desktop tooling</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">How to reach me</h3>
      <ul class="mb-4 list-disc list-inside">
        <li>
          Email:{" "}
          <a
            href="mailto:younghyun1@gmail.com"
            class="underline text-blue-700 dark:text-blue-300"
          >
            younghyun1@gmail.com
          </a>
        </li>
      </ul>
    </section>
  );
}
