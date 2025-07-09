import { createSignal, createEffect, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { authApi, dropdownApi } from "../services/all_api";

function SignupPage() {
  // form fields
  const [userName, setUserName] = createSignal("");
  const [userEmail, setUserEmail] = createSignal("");
  const [userPassword, setUserPassword] = createSignal("");
  const [userCountry, setUserCountry] = createSignal<number | "">("");
  const [userLanguage, setUserLanguage] = createSignal<number | "">("");
  const [userSubdivision, setUserSubdivision] = createSignal<number | "">(null);

  // status
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<null | {
    user_email: string;
    verify_by: string;
  }>(null);

  // dropdown data
  const [countries, setCountries] = createSignal<any[]>([]);
  const [languages, setLanguages] = createSignal<any[]>([]);
  const [subdivisions, setSubdivisions] = createSignal<any[]>([]);

  const navigate = useNavigate();

  // initial fetch on mount
  onMount(() => {
    console.log("[onMount] fetching country & language lists…");
    dropdownApi
      .countryList()
      .then((res) => {
        const list = Array.isArray(res.data?.countries)
          ? res.data.countries
          : [];
        console.log("[countryList] got", list.length, "countries");
        setCountries(list);
      })
      .catch((e) => console.error("[countryList] error", e));

    dropdownApi
      .languageList()
      .then((res) => {
        const list = res.data ?? [];
        console.log("[languageList] got", list.length, "languages");
        setLanguages(list);
      })
      .catch((e) => console.error("[languageList] error", e));
  });

  // fetch subdivisions whenever country changes
  createEffect(() => {
    const c = userCountry();
    console.log("[effect] userCountry changed to", c);
    if (c !== "") {
      dropdownApi
        .countrySubdivisions(c)
        .then((res) => {
          const subs = Array.isArray(res.data) ? res.data : [];
          console.log("[subdivisions] got", subs.length, "for country", c);
          setSubdivisions(subs);
        })
        .catch((e) => {
          console.error("[subdivisions] error", e);
          setSubdivisions([]);
        });
    } else {
      console.log("[subdivisions] clearing due to no country");
      setSubdivisions([]);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // basic validation
    if (
      !userName() ||
      !userEmail() ||
      !userPassword() ||
      !userCountry() ||
      !userLanguage()
    ) {
      setError("Please fill out all required fields.");
      console.warn("[handleSubmit] validation failed");
      setLoading(false);
      return;
    }

    const body = {
      user_name: userName(),
      user_email: userEmail(),
      user_password: userPassword(),
      user_country: Number(userCountry()),
      user_language: Number(userLanguage()),
      user_subdivision:
        userSubdivision() === "" ? null : Number(userSubdivision()),
    };
    console.log("[handleSubmit] submitting:", body);

    try {
      const res = await authApi.signup(body);
      console.log("[signup API] response", res);
      if (res.success && res.data) {
        console.log("[signup API] success, setting success state");
        setSuccess(res.data);
      } else {
        console.warn("[signup API] reported failure");
        setError("Signup failed.");
      }
    } catch (err: any) {
      console.error("[signup API] exception", err);
      setError(err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // shared classes for inputs & selects
  const commonFieldClasses =
    "w-full mb-4 rounded px-3 py-3 border " +
    "border-gray-300 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 " +
    "text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 " +
    "transition-colors duration-150";

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-150">
      <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl min-w-[350px] flex flex-col items-center transition-colors duration-150">
        <h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Sign Up
        </h2>

        <Show
          when={!success()}
          fallback={
            <div class="w-full text-center">
              <div class="text-green-700 dark:text-green-300 mb-3 font-semibold">
                Signup successful! Please check your email to verify your
                account.
              </div>
              <button
                class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-150 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => {
                  console.log("[fallback] navigating to /login");
                  navigate("/login");
                }}
              >
                Go to Login
              </button>
            </div>
          }
        >
          <form
            onSubmit={handleSubmit}
            class="w-full flex flex-col items-center"
          >
            <input
              type="text"
              placeholder="Username"
              value={userName()}
              onInput={(e) => {
                const v = e.currentTarget.value;
                console.log("[input] userName:", v);
                setUserName(v);
              }}
              class={commonFieldClasses}
              required
            />

            <input
              type="email"
              placeholder="Email"
              autocomplete="username email"
              value={userEmail()}
              onInput={(e) => {
                const v = e.currentTarget.value;
                console.log("[input] userEmail:", v);
                setUserEmail(v);
              }}
              class={commonFieldClasses}
              required
            />

            <input
              type="password"
              placeholder="Password"
              autocomplete="new-password"
              value={userPassword()}
              onInput={(e) => {
                const v = e.currentTarget.value;
                console.log("[input] userPassword:", v);
                setUserPassword(v);
              }}
              class={commonFieldClasses}
              required
            />

            <select
              value={userCountry()}
              onInput={(e) => {
                const raw = e.currentTarget.value;
                const val = raw === "" ? "" : Number(raw);
                console.log("[select] userCountry:", val);
                setUserCountry(val);
              }}
              class={commonFieldClasses}
              required
            >
              <option
                class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value=""
              >
                Select Country…
              </option>
              {countries().map((c) => (
                <option
                  value={c.country_code}
                  class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  {(c.country_flag ? c.country_flag + " " : "") +
                    (c.country_eng_name ?? c.country_name)}
                </option>
              ))}
            </select>

            <select
              value={userLanguage()}
              onInput={(e) => {
                const raw = e.currentTarget.value;
                const val = raw === "" ? "" : Number(raw);
                console.log("[select] userLanguage:", val);
                setUserLanguage(val);
              }}
              class={commonFieldClasses}
              required
            >
              <option
                class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value=""
              >
                Select Language…
              </option>
              {(() => {
                // primary-first reorder
                const all = languages() ?? [];
                const country = countries().find(
                  (c) => Number(c.country_code) === Number(userCountry()),
                );
                const primary = Number(country?.country_primary_language);
                let ordered = all;
                if (
                  primary &&
                  all.some((l) => Number(l.language_id) === primary)
                ) {
                  ordered = [
                    ...all.filter((l) => Number(l.language_id) === primary),
                    ...all.filter((l) => Number(l.language_id) !== primary),
                  ];
                }
                return ordered.map((l) => (
                  <option
                    value={l.language_id}
                    class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    {l.language_name ?? l.language_eng_name}
                  </option>
                ));
              })()}
            </select>

            <select
              value={userSubdivision()}
              onInput={(e) => {
                const raw = e.currentTarget.value;
                const val = raw === "" ? null : Number(raw);
                console.log("[select] userSubdivision:", val);
                setUserSubdivision(val);
              }}
              class={`w-full mb-6 rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150`}
              disabled={subdivisions().length === 0}
            >
              <option
                class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value=""
              >
                No Subdivision / N/A
              </option>
              {subdivisions().map((s) => (
                <option
                  value={s.subdivision_id}
                  class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  {s.subdivision_name}
                </option>
              ))}
            </select>

            <Show when={error()}>
              <div class="w-full text-sm text-red-600 dark:text-red-400 mb-3 text-center">
                {error()}
              </div>
            </Show>

            <button
              class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-150 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-70"
              type="submit"
              disabled={loading()}
            >
              {loading() ? "Signing Up…" : "Sign Up"}
            </button>

            <button
              class="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-150 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="button"
              onClick={() => {
                console.log("[button] Back to login");
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
