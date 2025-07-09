import { createSignal, createEffect, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { authApi, dropdownApi } from "../services/all_api";

function SignupPage() {
  // ––––– form state (all dropdowns as strings!)
  const [userName, setUserName] = createSignal("");
  const [userEmail, setUserEmail] = createSignal("");
  const [userPassword, setUserPassword] = createSignal("");
  const [userCountry, setUserCountry] = createSignal("");
  const [userLanguage, setUserLanguage] = createSignal("");
  const [userSubdivision, setUserSubdivision] = createSignal("");

  // ––––– status flags
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<null | {
    user_email: string;
    verify_by: string;
  }>(null);

  // ––––– dropdown data
  const [countries, setCountries] = createSignal<any[]>([]);
  const [languages, setLanguages] = createSignal<any[]>([]);
  const [subdivisions, setSubdivisions] = createSignal<any[]>([]);

  const navigate = useNavigate();

  // ––––– fetch countries & languages once on mount
  onMount(() => {
    console.log("[onMount] fetching countryList & languageList");
    dropdownApi
      .countryList()
      .then((res) => {
        const arr = Array.isArray(res.data?.countries)
          ? res.data.countries
          : [];
        console.log("[countryList] got", arr.length);
        setCountries(arr);
      })
      .catch((err) => console.error("[countryList] ERROR", err));

    dropdownApi
      .languageList()
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        console.log("[languageList] got", arr.length);
        setLanguages(arr);
      })
      .catch((err) => console.error("[languageList] ERROR", err));
  });

  // ––––– whenever userCountry changes, fetch subdivisions
  createEffect(() => {
    const cc = userCountry();
    console.log("[effect] country changed →", cc);
    if (cc) {
      dropdownApi
        .countrySubdivisions(Number(cc))
        .then((res) => {
          const arr = Array.isArray(res.data) ? res.data : [];
          console.log("[subdivisions] got", arr.length);
          setSubdivisions(arr);
        })
        .catch((err) => {
          console.error("[subdivisions] ERROR", err);
          setSubdivisions([]);
        });
    } else {
      console.log("[subdivisions] cleared");
      setSubdivisions([]);
    }
  });

  // ––––– on form submit
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !userName() ||
      !userEmail() ||
      !userPassword() ||
      !userCountry() ||
      !userLanguage()
    ) {
      setError("Please fill out all required fields.");
      console.warn("[submit] validation failed");
      return;
    }

    setLoading(true);
    const body = {
      user_name: userName(),
      user_email: userEmail(),
      user_password: userPassword(),
      user_country: Number(userCountry()),
      user_language: Number(userLanguage()),
      user_subdivision: userSubdivision() ? Number(userSubdivision()) : null,
    };
    console.log("[submit] payload:", body);

    try {
      const res = await authApi.signup(body);
      console.log("[signup] response", res);
      if (res.success && res.data) {
        setSuccess(res.data);
      } else {
        setError("Signup failed.");
      }
    } catch (err: any) {
      console.error("[signup] exception", err);
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // ––––– sort languages: primary first by language_code, rest alphabetically by language_eng_name
  const sortedLanguages = () => {
    const all = [...languages()];
    const cc = Number(userCountry());
    const country = countries().find((c) => Number(c.country_code) === cc);
    const primaryCode = Number(country?.country_primary_language);

    // pull out the primary (if any)
    const primary = all.find((l) => Number(l.language_code) === primaryCode);

    // sort the rest by english name A→Z
    const rest = all
      .filter((l) => Number(l.language_code) !== primaryCode)
      .sort((a, b) => {
        const na = (a.language_eng_name ?? "").toLowerCase();
        const nb = (b.language_eng_name ?? "").toLowerCase();
        return na.localeCompare(nb);
      });

    return primary ? [primary, ...rest] : rest;
  };

  const fieldClasses =
    "w-full mb-4 px-3 py-3 border rounded " +
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 " +
    "border-gray-300 dark:border-gray-700 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all";

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="w-[350px] p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Sign Up
        </h2>

        <Show
          when={!success()}
          fallback={
            <div class="text-center">
              <p class="mb-4 text-green-700 dark:text-green-300">
                Signup successful! Check your email to verify your account.
              </p>
              <button
                class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => {
                  console.log("[action] go to /login");
                  navigate("/login");
                }}
              >
                Go to Login
              </button>
            </div>
          }
        >
          <form onSubmit={handleSubmit}>
            <input
              class={fieldClasses}
              type="text"
              placeholder="Username"
              value={userName()}
              onInput={(e) => setUserName(e.currentTarget.value)}
            />

            <input
              class={fieldClasses}
              type="email"
              placeholder="Email"
              autocomplete="username email"
              value={userEmail()}
              onInput={(e) => setUserEmail(e.currentTarget.value)}
            />

            <input
              class={fieldClasses}
              type="password"
              placeholder="Password"
              autocomplete="new-password"
              value={userPassword()}
              onInput={(e) => setUserPassword(e.currentTarget.value)}
            />

            <select
              class={fieldClasses}
              value={userCountry()}
              onInput={(e) => {
                console.log("[select] userCountry →", e.currentTarget.value);
                setUserCountry(e.currentTarget.value);
              }}
              required
            >
              <option value="">Select Country…</option>
              {countries().map((c) => (
                <option value={c.country_code}>
                  {c.country_flag ? c.country_flag + " " : ""}
                  {c.country_eng_name ?? c.country_name}
                </option>
              ))}
            </select>

            <select
              class={fieldClasses}
              value={userLanguage()}
              onInput={(e) => {
                console.log(
                  "[select] raw userLanguage →",
                  e.currentTarget.value,
                );
                setUserLanguage(e.currentTarget.value);
              }}
              required
            >
              <option value="">Select Language…</option>
              {sortedLanguages().map((l) => (
                <option value={l.language_code}>{l.language_eng_name}</option>
              ))}
            </select>

            <select
              class={fieldClasses + " mb-6"}
              value={userSubdivision()}
              onInput={(e) => {
                console.log(
                  "[select] userSubdivision →",
                  e.currentTarget.value,
                );
                setUserSubdivision(e.currentTarget.value);
              }}
              disabled={!subdivisions().length}
            >
              <option value="">No Subdivision / N/A</option>
              {subdivisions().map((s) => (
                <option value={s.subdivision_id}>{s.subdivision_name}</option>
              ))}
            </select>

            <Show when={error()}>
              <div class="mb-4 text-center text-red-600 dark:text-red-400">
                {error()}
              </div>
            </Show>

            <button
              type="submit"
              disabled={loading()}
              class="w-full mb-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              {loading() ? "Signing Up…" : "Sign Up"}
            </button>

            <button
              type="button"
              class="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                console.log("[action] back to /login");
                navigate("/login");
              }}
            >
              Back to Login
            </button>
          </form>
        </Show>
      </div>
    </div>
  );
}

export default SignupPage;
