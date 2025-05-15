import { createEffect, Suspense } from 'solid-js';

export default function About() {
  return (
    <section class="bg-pink-100 dark:bg-pink-900 text-gray-700 dark:text-gray-100 p-8 min-h-screen transition-colors duration-150">
      <h1 class="text-2xl font-bold mb-2">About</h1>

      <h2 class="text-xl font-semibold mt-2 mb-2">Chi Younghyun / 지영현 / 池營賢</h2>
      <h3 class="text-lg font-medium mb-4">Backend Software Engineer</h3>

      <div class="flex flex-wrap gap-2 mb-4">
        <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=orange" alt="Rust" />
        <img src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=white" alt="C" />
        <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=green" alt="Python" />
        <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white" alt="Java" />
        <img src="https://img.shields.io/badge/Axum-000000?style=for-the-badge&logo=rust&logoColor=orange" alt="Axum" />
        <img src="https://img.shields.io/badge/postgres-000000?style=for-the-badge&logo=postgresql&logoColor=blue" alt="PostgreSQL" />
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
        <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
        <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="GCS" />
        <img src="https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white" alt="Azure" />
        <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
        <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
        <img src="https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white" alt="Arch Linux" />
        <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
        <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows" />
        <img src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="macOS" />
      </div>

      <p class="mb-4">
        I am a software engineer with experience in integrating sensors, meters, appliances, and other systems into construction engineering software services using <b>Rust</b>, <b>Axum</b>, <b>postgreSQL</b>, and <b>AWS</b>. My past efforts have included researching and applying caching strategies for a latency-sensitive BEMS service dealing with large amounts of real-time sensor data, deployed internationally. Experienced in managing and cutting down cloud infrastructure costs in fiscally constrained environments.
      </p>

      <p class="mb-4">
        I graduated from <b>Sungkyunkwan University</b> with a B. Eng in Software Engineering.
      </p>

      <p class="mb-6">
        Always aspiring towards system programming expertise and the upholding of open-source ethics as well as the right of STEM workers everywhere in the world.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-2">Background</h3>
      <ul class="mb-4 list-disc list-inside">
        <li><b>Company:</b> Suggestions welcome!</li>
        <li><b>Role:</b> Backend Software Engineer</li>
        <li><b>Education:</b> B. Eng in Software Engineering, Sungkyunkwan University, Republic of Korea</li>
        <li><b>Other Experiences:</b> soldiering, interpretation, translation, logistics, tutoring/lecturing, photography</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Technology Stack</h3>
      <ul class="mb-4 list-disc list-inside">
        <li><b>Programming Languages:</b> Rust, C, C++, Java, Python, x86 Assembly, JS, TS</li>
        <li><b>Languages:</b> Korean (Native), English (C2), French/German/Spanish/Mandarin (Rudimentary)</li>
        <li><b>Frameworks:</b> Axum, Express, Spring</li>
        <li><b>Platforms:</b> AWS, GCP, Oracle Cloud, Naver Cloud</li>
        <li><b>DBs:</b> PostgreSQL, MySQL, SQLite, Redis...and the good old in-RAM lookup table.</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Interests</h3>
      <ul class="mb-4 list-disc list-inside">
        <li>High-Throughput Webservers</li>
        <li>Cache Hierarchy</li>
        <li><b>Effective Concurrency through Asynchronity and Parallelism</b></li>
        <li><b>On-Prem Infrastructure</b></li>
        <li>Cloud Infrastructure</li>
        <li>CI/CD</li>
        <li>CLI Tooling and Automation</li>
        <li>Operating Systems</li>
        <li>Compilers</li>
        <li>Construction Engineering</li>
        <li>Electrical Engineering</li>
        <li>Video Game Modding</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">Studying</h3>
      <ul class="mb-4 list-disc list-inside">
        <li>Performance optimization in Rust applications</li>
        <li>Electrical systems</li>
        <li>HVAC systems</li>
      </ul>

      <h3 class="text-lg font-semibold mt-6 mb-2">How to reach me</h3>
      <ul class="mb-4 list-disc list-inside">
        <li>Email: <a href="mailto:younghyun1@gmail.com" class="underline text-blue-700 dark:text-blue-300">younghyun1@gmail.com</a></li>
      </ul>
    </section>
  );
}
