import { createSignal, createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { authApi, dropdownApi } from "../services/all_api";

function SignupPage() {
  const [userName, setUserName] = createSignal("");
  const [userEmail, setUserEmail] = createSignal("");
  const [userPassword, setUserPassword] = createSignal("");
  const [userCountry, setUserCountry] = createSignal<number | "">("");
  const [userLanguage, setUserLanguage] = createSignal<number | "">("");
  const [userSubdivision, setUserSubdivision] = createSignal<number | "">(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<null | {
    user_email: string;
    verify_by: string;
  }>(null);

  // Dropdown options
  const [countries, setCountries] = createSignal<any[]>([]);
  const [languages, setLanguages] = createSignal<any[]>([]);
  const [subdivisions, setSubdivisions] = createSignal<any[]>([]);

  const navigate = useNavigate();

  // Fetch countries and languages on mount
  createEffect(() => {
    dropdownApi
      .countryList()
      .then((res) =>
        setCountries(
          Array.isArray(res.data?.countries) ? res.data.countries : [],
        ),
      );
    dropdownApi.languageList().then((res) => setLanguages(res.data ?? []));
  });

  // Fetch subdivisions when country changes
  createEffect(() => {
    if (userCountry() !== "") {
      dropdownApi
        .countrySubdivisions(userCountry())
        .then((res) =>
          setSubdivisions(Array.isArray(res.data) ? res.data : []),
        );
    } else {
      setSubdivisions([]);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Basic validation
      if (
        !userName() ||
        !userEmail() ||
        !userPassword() ||
        !userCountry() ||
        !userLanguage()
      ) {
        setError("Please fill out all required fields.");
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
      const res = await authApi.signup(body);
      if (res.success && res.data) {
        setSuccess(res.data);
      } else {
        setError("Signup failed.");
      }
    } catch (e: any) {
      setError(e?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-90">
      <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl min-w-[350px] flex flex-col items-center transition-colors duration-90">
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
                class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-90 font-semibold"
                onClick={() => navigate("/login")}
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
              onInput={(e) => setUserName(e.currentTarget.value)}
              class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="email"
              placeholder="Email"
              autocomplete="username email"
              value={userEmail()}
              onInput={(e) => setUserEmail(e.currentTarget.value)}
              class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="password"
              placeholder="Password"
              autocomplete="new-password"
              value={userPassword()}
              onInput={(e) => setUserPassword(e.currentTarget.value)}
              class="w-full mb-4 text-base rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              required
            />
            <select
              value={userCountry() ?? ""}
              onInput={(e) =>
                setUserCountry(
                  e.currentTarget.value === ""
                    ? ""
                    : Number(e.currentTarget.value),
                )
              }
              class="w-full mb-4 rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
              required
            >
              <option value="">Select Country...</option>
              {countries().map((country) => (
                <option
                  value={country.country_code}
                  selected={userCountry() == country.country_code?.toString()}
                  class="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"
                >
                  {(country.country_flag ? country.country_flag + " " : "") +
                    (country.country_eng_name ?? country.country_name)}
                </option>
              ))}
            </select>
            <select
              value={userLanguage() ?? ""}
              onInput={(e) =>
                setUserLanguage(
                  e.currentTarget.value === ""
                    ? ""
                    : Number(e.currentTarget.value),
                )
              }
              class="w-full mb-4 rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
              style="color: inherit; background-color: inherit;"
              required
            >
              <option value="">Select Language...</option>
              {(() => {
                const allLangs = languages() ?? [];
                const country = countries().find(
                  (c) => Number(c.country_code) === Number(userCountry()),
                );
                const primaryLangId = Number(country?.country_primary_language);
                let withPrimaryFirst = allLangs;
                if (
                  primaryLangId &&
                  allLangs.some(
                    (lang) => Number(lang.language_id) === primaryLangId,
                  )
                ) {
                  withPrimaryFirst = [
                    ...allLangs.filter(
                      (lang) => Number(lang.language_id) === primaryLangId,
                    ),
                    ...allLangs.filter(
                      (lang) => Number(lang.language_id) !== primaryLangId,
                    ),
                  ];
                }
                return withPrimaryFirst.map((lang) => (
                  <option
                    value={lang.language_id}
                    selected={userLanguage() === String(lang.language_id)}
                    class="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"
                  >
                    {lang.language_name ?? lang.language_eng_name}
                  </option>
                ));
              })()}
            </select>
            <select
              value={userSubdivision() ?? ""}
              onInput={(e) =>
                setUserSubdivision(
                  e.currentTarget.value === ""
                    ? null
                    : Number(e.currentTarget.value),
                )
              }
              class="w-full mb-6 rounded px-3 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-90"
              disabled={!subdivisions().length}
            >
              <option value="">No Subdivision / Not Applicable</option>
              {subdivisions().map((sub) => (
                <option
                  value={sub.subdivision_id}
                  selected={userSubdivision() == sub.subdivision_id?.toString()}
                  class="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"
                >
                  {sub.subdivision_name}
                </option>
              ))}
            </select>
            <Show when={error()}>
              <div class="w-full text-sm text-red-600 dark:text-red-400 mb-3 text-center">
                {error()}
              </div>
            </Show>
            <button
              class="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded mb-3 transition-colors duration-90 font-semibold disabled:opacity-70"
              type="submit"
              disabled={loading()}
            >
              {loading() ? "Signing Up..." : "Sign Up"}
            </button>
            <button
              class="w-full py-3 text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded transition-colors duration-90 font-semibold"
              type="button"
              onClick={() => navigate("/login")}
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
