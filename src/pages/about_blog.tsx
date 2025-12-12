export default function AboutBlog() {
  return (
    <div class="bg-sky-50 dark:bg-black min-h-screen transition-colors duration-90">
      <section class="max-w-3xl mx-auto text-gray-700 dark:text-gray-100 p-8">
        <div class="border-l-4 border-sky-500 dark:border-sky-400 pl-3 mb-8">
          <h1 class="text-2xl font-bold mb-1 tracking-tight">
            Blog Tech Stack
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Last updated: 2025-12-12<br></br>In this section, I detail how I've
            obsessed over optimization across the stack.
          </p>
        </div>

        <section class="space-y-8">
          {/* 0) On-Prem */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              0) Host Machine, OS, filesystem, and network configuration
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The site is hosted on a miniserver at my residence behind a 1Gbps
              wired Xfinity connection. The{" "}
              <a
                href="https://store.minisforum.com/products/minisforum-um690l-slim"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                host
              </a>{" "}
              has an eight-core Ryzen 9 mobile processor running at up to
              4.9GHz, 32GB of 6400MT/s RAM, and a 1TB NVMe SSD for storage. At
              ~$400, it's a steal compared to having to pay AWS the equivalent
              amount over a year or so for significantly more anemic hardware,
              and reflects my enthusiasm for self-hosting. It runs the
              integrated backend-frontend server, the postgreSQL database, and a
              Minecraft server. If you'd like to play, shoot me an email.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              0-1) ArchLinux
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Not exactly the OS of choice for an enterprise server; if I were
              working somewhere, I would have just done Debian Stable with an
              ext4 filesystem with any old database engine. However, I
              personally I really enjoy tinkering and trying out the latest
              builds of everything, as well as doing CPU architecture optimized
              builds and installs for packages, as provided by the wonderful{" "}
              <a
                href="https://somegit.dev/ALHP/ALHP.GO"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ALHP
              </a>{" "}
              project. I would like to try hosting something on Gentoo
              sometimes, but I suspect the builds <em>will</em> take forever.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              0-2) Using btrfs on a database-BE/FE-Minecraft host
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              <a
                href="https://en.wikipedia.org/wiki/Btrfs"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                btrfs
              </a>{" "}
              is a modern filesystem with snapshotting, CoW, compression, all
              the fancy tricks. However, it's not the best choice for a database
              engine host due to extensive fragmentation caused by CoW; I've
              mitigated this by excluding the postgreSQL and Minecraft data
              directories from CoW.{" "}
              <a
                href="https://www.enterprisedb.com/blog/postgres-vs-file-systems-performance-comparison"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                A postgreSQL filesystem benchmark
              </a>{" "}
              does reveal that btrfs in its default state isn't a great
              performer; however, I do suspect that the CoW disabling might make
              it an equal to ext4 and xfs. It would make for an interesting
              benchmark.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              0-3) Internal and external network configuration
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              When signing up for Xfinity's 2Gbps television cable Internet
              service, I hadn't realized that they would be cheap enough to
              provide a modem-router that in fact does <em>not</em> support
              2.5Gbps Ethernet. So 1Gbps it shall have to be, but I can't
              imagine a scenario in which that becomes a problem for my little
              website. Route 53 provides DNS services for my domain.
              <br></br>
              <br></br>
              Internally, there really is no reason to use reverse proxy,
              containerization or distributed service tools; it's just a plain
              old postgreSQL engine running on the OS, a Rust binary acting as
              both the front-end and API server, connected to the DB via a UNIX
              socket, which actually is way, way faster than{" "}
              <a
                href="https://www.cybertec-postgresql.com/en/postgresql-performance-advice-unix-sockets-vs-localhost/"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                just using localhost, as detailed here.
              </a>{" "}
              TPS can near-double, and not going through the redundant network
              stack also cuts latency in half; I've observed latencies as low as
              150 microseconds between the DB and the server. Using localhost
              typically got me around 600 microseconds. Not a scenario relevant
              to cloud enterprise service configurations, but it's neat. It's
              old-school. It's faster! PostgreSQL 18, which came out in November
              2025, also introduced async I/O in the form of{" "}
              <a
                href="https://pganalyze.com/blog/postgres-18-async-io"
                class="text-sky-700 dark:text-sky-300 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                io_uring support
              </a>{" "}
              and it has been enabled. Accelerates reads quite a bit.
            </p>
          </section>

          {/* 1) PostgreSQL */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              1) Data
            </h2>
            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-1) PostgreSQL 18
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Throughout my startup and corporate career in Korea, I've noticed
              a culture that considers MySQL or MariaDB the only worthwhile
              RDBMS and I've yet to figure out why. Some of my older bosses have
              told me that PostgreSQL used to be not considered a serious option
              at all, which is bizarre given that in the last decade or so, it's
              been making heavy strides in performance, extensibility,
              datatypes, and tooling and has arguably surpassed MySQL in so many
              ways, especially in terms of UUID datatype support and binary
              encoding of JSON data.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-2) Schema highlights (blog + auth)
            </h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>
                <span class="font-medium">posts</span>: slug, markdown-rendered
                HTML content, view/share counters, JSONB metadata, and cached
                vote counts
              </li>
              <li>
                <span class="font-medium">comments</span>: threaded via{" "}
                <span class="font-mono">parent_comment_id</span>, cached vote
                counts
              </li>
              <li>
                <span class="font-medium">post_votes/comment_votes</span>:{" "}
                <span class="font-mono">(target_id, user_id)</span> uniqueness,
                UPSERT-based vote toggling
              </li>
              <li>
                <span class="font-medium">users</span>: argon2 password hashes,
                email verification flag, country/language/subdivision fields
              </li>
              <li>
                <span class="font-medium">email_verification_tokens</span> and{" "}
                <span class="font-medium">password_reset_tokens</span>: strict
                expiry and used-at tracking
              </li>
            </ul>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-3) UUIDs
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Most entities use UUID primary keys. (The earlier “UUIDv7”
              direction is still a good fit for ordered inserts, but the current
              backend codebase largely uses standard UUID generation where
              needed.)
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-4) Diagram (request + data path)
            </h3>
            <div class="mt-3 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <pre class="overflow-x-auto p-4 text-xs leading-5 text-gray-600 dark:text-gray-400">{`Internet
 |
 v
[ISP modem/router]
 |
 v
[On-Prem Miniserver]
 |
 +--> [Axum (Rust) HTTPS server]
 |        |
 |        +--> [Diesel + diesel_async]
 |        |         |
 |        |         +--> [PostgreSQL (socket or TCP)]
 |        |
 |        +--> [In-memory caches]
 |        |      - blog PostInfo list (pagination)
 |        |      - country/language/currency tables
 |        |      - i18n bundle cache (bitcode bytes)
 |        |      - geo-ip DB (v4+v6 BTreeMap)
 |        |
 |        +--> [Embedded FE assets (.gz preferred)]
 |
 +--> [S3: user images / photographs]`}</pre>
            </div>
          </section>

          {/* 2) Backend */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              2) Backend (Rust)
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The backend is a single Axum service. It serves the SPA, exposes a
              JSON API, maintains small in-memory caches, and runs scheduled
              background maintenance jobs. Operationally, “one process + one DB”
              is the point.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-1) Axum + middleware
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Axum handles routing and middleware for:
              <span class="block mt-2">
                • request logging with timing + server build headers
                <br />
                • session-aware “logged in” detection for read endpoints
                <br />
                • auth enforcement for write endpoints (cookie session + expiry
                + email-verified gate)
                <br />• transparent gzip compression (tower-http)
              </span>
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-2) Diesel ORM + diesel_async
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Diesel provides typed query building and schema binding. Queries
              are written to be explainable (and easy to index). Async DB access
              is done through <span class="font-mono">diesel_async</span> with a{" "}
              <span class="font-mono">bb8</span> pool sized based on physical
              CPU cores.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-3) Authentication + sessions (cookie-based)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Sessions are stored in an in-memory concurrent map and keyed by a
              UUID session ID. The browser gets an{" "}
              <span class="font-mono">HttpOnly</span>,{" "}
              <span class="font-mono">Secure</span>,{" "}
              <span class="font-mono">SameSite=Strict</span> cookie. Expired
              sessions are purged by a scheduled job.
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>
                Email verification is enforced for protected endpoints (write
                operations).
              </li>
              <li>
                Password hashing and verification use Argon2 on{" "}
                <span class="font-mono">spawn_blocking</span>.
              </li>
              <li>Sensitive request DTOs zeroize password fields after use.</li>
            </ul>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-4) Email flows (verification + reset)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Signup generates an email verification token with an expiry window
              (currently 1 day) and sends an HTML email via SMTP (AWS SES
              relay). Password reset issues a time-limited token (currently 30
              minutes). Tokens are validated against: expiry, “created in the
              future” (fabrication detection), and “already used”.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-5) Caching and in-RAM tables
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The server maintains several in-memory caches to keep read latency
              low and reduce DB round trips:
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>
                <span class="font-medium">PostInfo cache</span>: post list
                pagination reads from RAM (synced at startup and updated on post
                create/edit/delete)
              </li>
              <li>
                <span class="font-medium">ISO tables</span>: countries,
                subdivisions, languages, and currencies loaded into indexed
                structures for fast lookup and direct JSON dispatch
              </li>
              <li>
                <span class="font-medium">i18n cache</span>: strings loaded once
                and indexed; bundles are served as compact bitcode bytes with
                cache freshness checks based on latest updated_at
              </li>
              <li>
                <span class="font-medium">Geo-IP DB</span>: compressed on disk,
                decompressed at boot into BTreeMaps (v4+v6), with interned
                strings to reduce RAM duplication
              </li>
            </ul>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-6) Static assets: embedded + pre-gzipped
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The frontend build output is embedded into the Rust binary using{" "}
              <span class="font-mono">rust-embed</span>. The server prefers{" "}
              <span class="font-mono">.gz</span> assets when available and sets{" "}
              <span class="font-mono">Content-Encoding: gzip</span>. This makes
              SPA delivery fast and avoids filesystem dependencies at runtime.
              Client-side routes fall back to{" "}
              <span class="font-mono">index.html</span>.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-7) Observability: tracing + structured errors
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Logging is built on <span class="font-mono">tracing</span>.
              Requests are timed and logged as RECV/RESP (or ERSP on errors).
              Errors use a structured <span class="font-mono">CodeError</span>{" "}
              model with a stable numeric code, HTTP status, a public message,
              and an internal detail string (kept out of JSON responses but used
              in logs).
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-8) Background jobs / scheduler
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              A lightweight in-process scheduler runs recurring maintenance
              jobs:
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>Invalidate expired sessions (hourly)</li>
              <li>
                Purge non-verified users with expired verification tokens
                (hourly)
              </li>
              <li>
                Update CPU/RAM snapshots for admin dashboards (every second)
              </li>
              <li>Compress old logs with zstd (daily)</li>
            </ul>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-9) Images and media (S3)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              User profile pictures and photographs are processed server-side
              and uploaded to S3. Images are resized and re-encoded (AVIF) using
              a fast resizing pipeline. EXIF shot timestamps are parsed when
              available. Admin-only endpoints exist for bulk deletion (DB is the
              source of truth; S3 deletions are best-effort side effects).
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-10) Build metadata (repro + diagnostics)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              A small <span class="font-mono">build.rs</span> generates{" "}
              <span class="font-mono">build_info.rs</span> at build time with:
              project name/version, build timestamp (UTC), rustc version, and a
              dependency/version map (via{" "}
              <span class="font-mono">cargo metadata</span>). The API exposes
              some of this for debugging (e.g. the{" "}
              <span class="font-mono">/api/auth/me</span> response includes
              build time and axum version), and the logging middleware attaches
              headers like <span class="font-mono">x-server-built-time</span>.
            </p>
          </section>

          {/* 3) Frontend */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              3) SolidJS frontend (SPA)
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The UI is a small SolidJS SPA. The page shell is static and fast,
              and dynamic data comes from the JSON API (posts, comments, auth
              state). The server is responsible for shipping an optimized SPA
              payload (embedded, gzipped) and keeping runtime behavior simple.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              3-1) Delivery model
            </h3>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <li>Prebuilt assets are embedded into the backend binary</li>
              <li>Pre-gzipped assets are preferred on the wire</li>
              <li>
                SPA fallback routes serve index.html for client-side navigation
              </li>
            </ul>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              3-2) Philosophy
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Most pages are content-first. The client does not try to mirror
              the entire server state; it fetches what it needs (post list, post
              details, comments) and keeps local state small.
            </p>
          </section>

          {/* 4) Network & HTTPS */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              4) HTTPS, routing, and safety rails
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              HTTPS is terminated directly in the Axum server using rustls. An
              additional lightweight listener redirects HTTP → HTTPS. Request
              sizes are capped (large uploads are explicitly allowed up to a
              fixed limit for photographs).
            </p>
          </section>
        </section>

        <footer class="mt-10 text-xs text-gray-500 dark:text-gray-400">
          This page evolves as the stack evolves. The goal stays the same:
          simple, fast, and easy to operate.
        </footer>
      </section>
    </div>
  );
}
