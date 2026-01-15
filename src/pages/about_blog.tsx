import { Component } from "solid-js";

const CodeBlock: Component<{
  title: string;
  code: string;
  href: string;
  language: "sql" | "rust" | "typescript";
}> = (props) => {
  let html = props.code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (props.language === "sql") {
    html = html
      .replace(
        /\b(CREATE|TABLE|PRIMARY|KEY|DEFAULT|NOT|NULL|CONSTRAINT|FOREIGN|REFERENCES|ON|DELETE|CASCADE|INDEX|UNIQUE|IF|EXISTS)\b/g,
        '<span class="text-pink-400 font-bold">$1</span>',
      )
      .replace(
        /\b(UUID|VARCHAR|TEXT|TIMESTAMPTZ|BOOLEAN)\b/g,
        '<span class="text-blue-400">$1</span>',
      )
      .replace(
        /\b(uuidv7|now|true|false)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(/--.*$/gm, '<span class="text-gray-500 italic">$&</span>');
  } else if (props.language === "rust") {
    // Rust highlighting
    html = html
      .replace(
        /\b(pub|use|struct|impl|async|fn|let|mut|if|else|match|return|crate|mod|static|const|type|enum|trait|for|while|loop|await|where|derive)\b/g,
        '<span class="text-pink-400 font-bold">$1</span>',
      )
      .replace(
        /\b(String|u64|usize|Vec|Option|Result|bool|str|i32|f64|u8|i8|i64|u32|i16|u16|Uuid|Arc|ServerState|Session|PostInfo|HashSet|HashMap|RwLock|AtomicU64|Pool|AsyncPgConnection|Uri|IntoResponse|StatusCode|HeaderMap|Embed|State|CookieJar|Request|Body|Next|HandlerResponse|DefaultBodyLimit|GovernorLayer)\b/g,
        '<span class="text-blue-400">$1</span>',
      )
      .replace(
        /\b(true|false|Some|None|Ok|Err|scc|tokio)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/#!?\[.*\]/g, '<span class="text-yellow-400">$&</span>'); // Attributes
  } else if (props.language === "typescript") {
    html = html
      .replace(
        /\b(const|let|var|export|import|from|function|async|await|return|if|else|try|catch|throw|new|typeof|instanceof|void|interface|type|declare|namespace|module|as)\b/g,
        '<span class="text-pink-400 font-bold">$1</span>',
      )
      .replace(
        /\b(Promise|string|number|boolean|any|unknown|null|undefined|void|object|Array|Record|RequestInit|Headers|Response|Element|HTMLElement|RouteDefinition|MeResponse)\b/g,
        '<span class="text-blue-400">$1</span>',
      )
      .replace(
        /\b(true|false|this|window|document|console|sessionStorage|localStorage|JSON|fetch|Error|import|meta|env)\b/g,
        '<span class="text-purple-400">$1</span>',
      )
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
  }

  return (
    <div class="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#1e1e1e] shadow-md dark:shadow-none ring-1 ring-gray-900/5">
      <div class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
        <span class="text-xs font-mono text-gray-400 truncate flex-1">
          {props.title}
        </span>
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-sky-400 hover:text-sky-300 hover:underline whitespace-nowrap ml-4"
        >
          GitHub ↗
        </a>
      </div>
      <div class="p-4 overflow-x-auto bg-[#1e1e1e]">
        <pre class="text-xs sm:text-sm font-mono leading-relaxed text-[#d4d4d4]">
          <code innerHTML={html}></code>
        </pre>
      </div>
    </div>
  );
};

export default function AboutBlog() {
  return (
    <div class="bg-sky-50 dark:bg-black min-h-screen transition-colors duration-90">
      <section class="max-w-3xl mx-auto text-gray-700 dark:text-gray-100 p-8">
        <div class="border-l-4 border-sky-500 dark:border-sky-400 pl-3 mb-8">
          <h1 class="text-2xl font-bold mb-1 tracking-tight">
            Blog Tech Stack
          </h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Last updated: 2026-01-14<br></br>
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
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The data model is boring in the best way: a small set of tables,
              aggressively indexed, with UUID primary keys and timestamp columns
              across the board.
              <br></br>
              <br></br>
              For authentication, I stick to the basics: a users table with
              hashed credentials.
            </p>

            <CodeBlock
              title="migrations/2025-01-20-045254_create_users/up.sql"
              language="sql"
              href="https://github.com/younghyun1/rust-be-template/blob/main/migrations/2025-01-20-045254_create_users/up.sql"
              code={`CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_name VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    user_password_hash VARCHAR NOT NULL,
    user_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`}
            />

            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The blog content is centered around the <em>posts</em> table. Note
              the foreign key constraint with cascade delete—letting the
              database handle cleanup prevents orphaned records better than any
              application logic ever could.
            </p>

            <CodeBlock
              title="migrations/2025-02-18-045958_posts_tables/up.sql"
              language="sql"
              href="https://github.com/younghyun1/rust-be-template/blob/main/migrations/2025-02-18-045958_posts_tables/up.sql"
              code={`CREATE TABLE posts (
    post_id UUID PRIMARY KEY DEFAULT uuidv7(),
    user_id UUID NOT NULL,
    post_title VARCHAR NOT NULL,
    post_slug VARCHAR NOT NULL,
    post_content TEXT NOT NULL,
    post_published_at TIMESTAMPTZ,
    post_is_published BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-3) UUIDv7
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              You might have noticed <code class="text-xs">uuidv7()</code> in
              the defaults above. I use UUIDv7 (time-ordered UUIDs) everywhere
              for primary keys. They provide the locality benefits of
              auto-incrementing integers (friendly to B-tree indexes) with the
              distributed uniqueness of UUIDs. This avoids the fragmentation
              penalty usually associated with random UUIDv4s while keeping IDs
              unguessable and unique across systems.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              1-4) Diagram (request + data path)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              A typical page view is:
              <br></br>
              <br></br>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                Browser → Rust server (Axum) → (cache hit?) → PostgreSQL (UNIX
                socket) → Rust (render/serialize) → compressed response
              </span>
              <br></br>
              <br></br>
              Static assets are served directly by the same Rust binary (more on
              that below), and images are offloaded to S3 so that the main host
              stays CPU-bound and predictable.
            </p>
          </section>

          {/* 2) Backend */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              2) Backend (Rust)
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The backend is a single Rust service that serves both the API and
              the compiled frontend assets. This keeps deployment and
              observability simple: one process, one set of logs, one set of
              knobs.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-1) Middleware (Authentication)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The HTTP layer is built on Axum with Tower middleware. I compose a
              strict stack of layers to ensure every request runs the gauntlet:
              CORS, rate limiting, and authentication state injection.
            </p>

            <CodeBlock
              title="src/routers/main_router.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/routers/main_router.rs"
              code={`let api_router = public_router
    .merge(protected_router)
    .layer(is_logged_in_middleware)
    .layer(log_middleware)
    .layer(DefaultBodyLimit::max(MAX_REQUEST_SIZE))
    .layer(GovernorLayer::new(governor_conf))
    .layer(cors_layer)
    .with_state(state.clone());`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-2) Diesel ORM + diesel_async
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              I use Diesel for schema safety and compile-time query checking,
              and <code class="text-xs">diesel_async</code> to avoid blocking
              the runtime.
            </p>

            <CodeBlock
              title="src/domain/i18n/i18n.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/domain/i18n/i18n.rs"
              code={`pub async fn get_by_id(id: uuid::Uuid, state: &Arc<ServerState>) -> anyhow::Result<Self> {
    let mut conn = state.get_conn().await?;
    let result: InternationalizationString = i18n_strings::table
        .filter(i18n_strings::i18n_string_id.eq(id))
        .first::<InternationalizationString>(&mut conn)
        .await
        .map_err(|e| code_err(CodeError::DB_QUERY_ERROR, e))?;
    Ok(result)
}`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-3) Authentication + sessions (cookie-based)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Sessions are cookie-based and backed by server-side state. My auth
              middleware verifies the session ID against the in-memory cache and
              checks expiration before the request ever reaches a handler.
            </p>

            <CodeBlock
              title="src/routers/middleware/auth.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/routers/middleware/auth.rs"
              code={`pub async fn auth_middleware(
    State(state): State<Arc<ServerState>>,
    cookie_jar: CookieJar,
    mut request: Request<Body>,
    next: Next,
) -> HandlerResponse<impl IntoResponse> {
    let session_id = match cookie_jar.get("session_id") {
        Some(cookie) => Uuid::from_str(cookie.value())?,
        None => return Err(code_err(CodeError::UNAUTHORIZED_ACCESS, "Missing cookie")),
    };

    let session = state.get_session(&session_id).await?;

    if !session.is_unexpired() {
        return Err(code_err(CodeError::UNAUTHORIZED_ACCESS, "Session expired"));
    }

    request.extensions_mut().insert(session.get_user_id());
    Ok(next.run(request).await)
}`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-4) Email flows (verification + reset)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Signup triggers an email verification flow, and forgotten password
              uses a reset flow. Both are implemented as time-limited tokens
              stored server-side (so I can revoke them and rate limit them) and
              delivered via email links. I route mail through SMTP (AWS SES in
              production) because deliverability is a solved problem if you use
              the boring tools and set up DNS properly.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-5) Caching and in-RAM tables
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              For data that is read-heavy and changes rarely (post lists,
              country data, i18n bundles), I cache in memory. This isn't about
              raw speed as much as it is about stability: the database should
              not be doing repetitive work that the application can do once. I
              use <code class="text-xs">scc</code> (scalable concurrent
              containers) to avoid lock contention on these hot structures.
            </p>

            <CodeBlock
              title="src/init/state/server_state.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/init/state/server_state.rs"
              code={`pub struct ServerState {
    pub(crate) session_map: scc::HashMap<uuid::Uuid, Session>, // read/write
    pub(crate) blog_posts_cache: scc::HashMap<uuid::Uuid, PostInfo>, // read/write
    pub visitor_board_map: scc::HashMap<([u8; 8], [u8; 8]), u64>, // read/write
    pub(crate) api_keys_set: HashSet<Uuid>,                    // read-only
    pub country_map: RwLock<CountryAndSubdivisionsTable>,
    pub languages_map: RwLock<IsoLanguageTable>,
    // ...
}`}
            />

            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              I also use <code class="text-xs">bitcode</code> for compact
              serialization of large datasets (like i18n bundles) before caching
              them.
            </p>

            <CodeBlock
              title="src/domain/i18n/i18n.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/domain/i18n/i18n.rs"
              code={`#[derive(Encode)]
pub struct InternationalizationStringsToBeEncoded {
    pub i18n_string_content: String,
    pub i18n_string_reference_key: String,
}

// ...
let to_encode: Vec<InternationalizationStringsToBeEncoded> = rows
    .into_iter()
    .map(InternationalizationStringsToBeEncoded::from)
    .collect();

(encode(&to_encode), Some(max_updated_at))`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-6) Static assets: embedded + pre-gzipped
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              The frontend build output is served directly by the backend. For
              the hottest assets, I prefer precompressed delivery (gzipped) so
              the server spends less CPU time compressing the same bytes over
              and over. This also makes first-load performance more consistent
              across traffic spikes.
            </p>

            <CodeBlock
              title="src/routers/main_router.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/routers/main_router.rs"
              code={`#[derive(Embed)]
#[folder = "fe/"]
struct EmbeddedAssets;

async fn static_asset_handler(uri: Uri) -> impl IntoResponse {
    let mut path = uri.path().trim_start_matches('/').to_string();
    if path.is_empty() {
        path = "index.html".to_string();
    }

    // 1. Check for a pre-compressed .gz file first
    let gzip_path = format!("{path}.gz");
    if let Some(content) = EmbeddedAssets::get(&gzip_path) {
        // ... return pre-compressed content ...
    }
    // ... fallback to raw file ...
}`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-7) Observability: tracing + structured errors
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Logging is built on <code class="text-xs">tracing</code> with
              structured fields. Errors are returned with consistent codes and
              are also logged with enough context to be actionable. I care a lot
              about not having “mystery failures”: even a hobby project should
              be diagnosable when something goes wrong at 2AM.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-8) Background jobs / scheduler
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              There are a few jobs that run out-of-band: cleaning up expired
              tokens, refreshing reference datasets, and any periodic
              maintenance tasks that I don't want on the request path. Keeping
              this inside the same binary is again a simplicity choice; if the
              job system ever grows teeth, it can be split into a worker later.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-9) Images and media (S3)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Images are stored on S3 and served from there. This keeps my home
              uplink from being the bottleneck and makes the heavy bytes someone
              else's problem. I store originals and also generate thumbnails in
              modern formats (AVIF/WebP where applicable), because bandwidth is
              still the most common performance problem on the web.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              2-10) Build metadata (repro + diagnostics)
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              I like builds to be identifiable. The running server exposes build
              metadata (version string, environment, and a few relevant flags)
              so I can tell exactly what is deployed. This is not glamorous, but
              it is the difference between “I think it's updated” and “I know
              it's updated”.
            </p>

            <CodeBlock
              title="src/build_info.rs"
              language="rust"
              href="https://github.com/younghyun1/rust-be-template/blob/main/src/build_info.rs"
              code={`pub const PROJECT_NAME: &str = "rust-be-template";
pub const PROJECT_VERSION: &str = "0.1.0";
pub const BUILD_TIME_UTC: &str = "2026-01-14T23:08:42.767115600+00:00";
pub const RUSTC_VERSION: &str = "rustc 1.92.0 (ded5c06cf 2025-12-08)";`}
            />
          </section>

          {/* 3) Frontend */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              3) SolidJS frontend (SPA)
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The frontend is a client-side rendered SolidJS app. Solid hits a
              sweet spot for me: it feels close to the metal, it compiles away a
              lot of framework overhead, and it makes it easy to build UIs that
              stay fast without resorting to elaborate memoization rituals.
            </p>

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              3-1) Routing & Lazy Loading
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              I use <code>@solidjs/router</code> with route-based code
              splitting. Each major page component is lazy-loaded, ensuring the
              initial bundle remains small.
            </p>

            <CodeBlock
              title="src/routes.ts"
              language="typescript"
              href="https://github.com/younghyun1/solid-csr-spa-template/blob/main/src/routes.ts"
              code={`export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/blog",
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/posts/List")),
      },
      {
        path: "/:post_id",
        component: lazy(() => import("./pages/posts/View")),
      },
    ],
  },
  // ...
];`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              3-2) API wrapper & Build Headers
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              All backend communication goes through a unified{" "}
              <code>apiFetch</code> wrapper. This handles authentication
              redirects (401/403), injects the API key, and crucially, listens
              for custom server build headers. This allows the frontend to
              detect when the backend has been redeployed and update its
              internal diagnostics state.
            </p>

            <CodeBlock
              title="src/services/api.ts"
              language="typescript"
              href="https://github.com/younghyun1/solid-csr-spa-template/blob/main/src/services/api.ts"
              code={`export async function apiFetch(path: string, options: RequestInit = {}) {
  options.headers = {
    ...(options.headers || {}),
    "x-api-key": API_KEY,
  };

  const response = await fetch(apiUrl(path), options);

  // Capture backend build info from headers
  const builtTime = response.headers.get("x-server-built-time");
  const serverName = response.headers.get("x-server-name");

  if (builtTime || serverName) {
    setServerBuildInfo((prev) => ({
      ...prev,
      built_time: builtTime ?? prev.built_time,
      name: serverName ?? prev.name,
    }));
  }

  if (response.status === 401) {
    setAuthenticated(false);
    // ... redirect logic ...
  }

  return response;
}`}
            />

            <h3 class="mt-5 text-sm font-semibold text-gray-900 dark:text-gray-100">
              3-3) State Management
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              State management is kept simple using Solid's primitives. For
              global authentication state, I export a signal and a setter. This
              allows any component to reactively track the user's login status
              without the boilerplate of a complex store or context provider.
            </p>

            <CodeBlock
              title="src/state/auth.ts"
              language="typescript"
              href="https://github.com/younghyun1/solid-csr-spa-template/blob/main/src/state/auth.ts"
              code={`import { createSignal } from "solid-js";
import { MeResponse } from "../dtos/responses/auth";

export const [isAuthenticated, setAuthenticated] = createSignal<boolean | null>(
  null,
);
export const [user, setUser] = createSignal<MeResponse>(null);`}
            />
          </section>

          {/* 4) Network & HTTPS */}
          <section class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/40 p-5">
            <h2 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              4) HTTPS, routing, and safety rails
            </h2>
            <p class="text-sm leading-6 text-gray-600 dark:text-gray-400">
              The server terminates TLS and redirects HTTP to HTTPS in
              production. On top of that, I use conservative defaults: strict
              cookie settings, explicit CORS rules, and security headers that
              reduce foot-guns (for example, preventing MIME sniffing and
              restricting where content can be framed).
              <br></br>
              <br></br>I don't run a reverse proxy in front of it at home. That
              is not a statement of best practice; it's a reflection of scope.
              The fewer moving pieces I have, the easier it is to maintain, and
              the more time I get to spend on actual features.
            </p>
          </section>
        </section>
      </section>
    </div>
  );
}
