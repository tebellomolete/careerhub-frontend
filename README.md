# CareerHub Frontend - Assignment 1.1

## Part 1: Written Decisions

### 1. Lifting State Up

**What breaks if `JobList` owns the state:**
If we store `selectedId` inside `JobList`, the `Home` page has no way to access that information. Data in React flows downwards (from parent to child). If `Home` needs to show a summary panel with the selected job's title, it cannot reach into `JobList` to grab that state. The summary panel would break.

**The nearest common ancestor rule:**
This rule says that if two components (like the Summary Panel and `JobList`) need to share the same piece of data, that data should be placed in the parent component that wraps them both. In our case, `Home` is the parent of both, so putting the state in `Home` guarantees we can pass the data down to both successfully.

**The data flow cycle:**
1. A user clicks a `JobCard`.
2. The `JobCard` triggers its `onSelect` prop.
3. This calls the `setSelectedId` function living up in the `Home` component.
4. `Home` updates its state, which causes it to re-render.
5. `Home` passes the newly selected job data down to the Summary Panel (making it appear) and the new `selectedId` down to `JobList` to highlight the correct card.

### 2. The Re-render Cycle

**Confirming the colleague's claim:** The colleague is technically correct. By default, calling `setSelectedId` causes all the `JobCard` components to re-render.

* **What React does immediately:** When `setSelectedId` is called, React flags the `Home` component as needing an update because its state changed.
* **Why unchanged props still re-render:** In React, when a parent component (`Home`) re-renders, it automatically re-renders all of its children (`JobList` and `JobCard`), even if the specific props passed to a `JobCard` did not change.
* **React 19 compiler mechanism:** The new React 19 compiler introduces automatic memoization. It is smart enough to look at a component, realize its props haven't changed, and automatically skip re-rendering it without us having to write extra code.
* **Re-renders vs DOM updates:** A "re-render" just means React runs the component's code to see *if* anything looks different. A "DOM update" is when React actually changes what is drawn on the screen in the browser. React only performs a DOM update if the re-render produces a visually different result. This distinction matters because checking for changes (re-rendering) is very fast, but actually redrawing the browser screen (DOM updating) is slow.

### 3. Union Types versus String

Using a union type (`"FullTime" | "PartTime" | "Contract" | "Internship"`) is much safer than using a basic `string`. 

**Scenario 1: A simple typo**
If we use a string and a developer accidentally types `"Fulltime"` (lowercase 't'), TypeScript allows it. However, our Tailwind color dictionary might not recognize it, leaving the badge without styles. 
* **Error:** Missing styles (silent bug). 
* **Caught:** Too late, likely in the browser during testing. 
* **With Union:** TypeScript throws a compile error in the code editor immediately, saying `"Fulltime"` is not assignable to the union type.

**Scenario 2: The API adds "Freelance"**
If the backend adds `"Freelance"` and we haven't updated our frontend union type yet.
* **Error:** When we try to map colors in `badgeStyles`, TypeScript will immediately complain that `"Freelance"` is missing from our dictionary. 
* **Caught:** At compile time (during development or build). We cannot even build the app until we handle the new type, preventing a live app from crashing when encountering unexpected data. 

### 4. The && Rendering Trap

**Why 0 renders in the browser:**
In JavaScript, the number `0` is considered "falsy". When React evaluates `{job.applicantCount && <p>...`, it checks the left side. Because `0` is a falsy non-boolean value, JavaScript stops checking the right side and simply returns the value `0`. React sees the number `0` and renders it directly onto the screen as text.

**Correct Solutions:**
1. `{job.applicantCount > 0 && <p>...}` (Checks if it is strictly greater than 0, resulting in a true/false boolean).
2. `{job.applicantCount ? <p>... : null}` (Uses a ternary operator).

**Preference:** I prefer the first solution (`> 0 &&`) because it explicitly forces the evaluation to become a true `boolean` (`false`). React completely ignores boolean values, so it safely renders nothing, and the code is shorter to read.

---

## README Updates

### 1. Why Static Data First

Building against hardcoded data before connecting to a live API is the correct approach because it allows us to perfect our User Interface (UI) decisions without interference. We don't have to worry about slow internet, server crashes, or backend bugs slowing down our frontend work. 

A component that is "data-source agnostic" means the component does not care where its data comes from. Whether the data is passed from a local hardcoded array or a live web server, the component takes the props and renders the exact same way. 

### 2. Type Contract with the Backend

Our `JobListing` interface in `src/types/index.ts` is a direct mirror of the `JobListingResponse.cs` file on the backend. 

If a backend developer renames `salaryMin` to `minimumSalary` and generates a new TypeScript client for us, our `JobListing` interface will update to expect `minimumSalary`. Instantly, every single component in our frontend that still tries to read `job.salaryMin` will light up with a red TypeScript compilation error. The app will refuse to build, forcing us to fix the mismatches before the code ever reaches the user.

### 3. Component Responsibility Table

| Component | Owns state | Receives via props |
| :--- | :--- | :--- |
| **Home** | `selectedId` (string \| null) | *(None)* |
| **JobList** | *(None)* | `jobs` (JobListing[]), `selectedId` (string \| null), `onSelect` (callback function) |
| **JobCard** | *(None)* | `job` (JobListing), `isSelected` (boolean), `onSelect` (callback function) |

### 4. Gate

The project builds successfully with zero TypeScript errors and zero ESLint errors. 

```text
> careerhub-frontend@0.1.0 build
> next build

   ▲ Next.js 15.0.0
   - Environments: .env

 ✓ Linting and checking validity of types    
 ✓ Creating an optimized production build    
 ✓ Compiled successfully
 ✓ Collecting page data    
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    184 B          87.5 kB
└ ○ /_not-found                          871 B          88.2 kB
+ First Load JS shared by all            87.3 kB
  ├ chunks/23-1f14371719ab2662.js        31.5 kB
  ├ chunks/fd9d1056-2821b0f0cabcd8bd.js  53.6 kB
  └ other shared chunks (empty)

○  (Static)  prerendered as static content
```

### 5. The shadcn/ui Ownership Model
Unlike traditional component libraries (like Material UI or Bootstrap) where you install the components as npm modules, shadcn/ui installs the raw source code directly into your project (`src/components/ui/`). We completely own this code. If the original library updates and introduces a breaking change, our project is unaffected because our local source code remains untouched until we explicitly decide to update or modify it ourselves.

### 6. Why the `cn` Utility Exists
The `cn` utility combines `clsx` (for conditional classes) and `tailwind-merge` (for conflict resolution). If we used plain string concatenation like `` `p-4 ${isSelected ? 'p-6' : ''}` ``, Tailwind wouldn't know which padding to apply because both `p-4` and `p-6` would exist on the element. The `cn` utility parses these conflicts and intelligently strips out `p-4`, leaving only `p-6`. This allows us to define default styles and cleanly override them without CSS specificity bugs.

### 7. Event Handler vs `useEffect`
We placed our `sessionStorage` logic inside a `useEffect` rather than inside the `handleSelectJob` click handler. If we only wrote to storage on click, our storage would become out of sync if `selectedId` was changed by another mechanism (e.g., clearing the selection via a keyboard shortcut, or a "clear filters" button elsewhere in the app). By using `useEffect` tied to the `selectedId` state, we guarantee that *any* change to the state—regardless of what caused it—is synchronized to storage.

### 8. Source of Truth for Dark Mode
While we track `isDark` in React state to update the toggle button's text, the actual "source of truth" for the application's appearance is the DOM—specifically, the presence of the `dark` class on the `<html>` (`document.documentElement`) element. React state simply observes and controls this DOM class, but Tailwind applies the dark mode styling purely based on the DOM's class list.

### 9. Component Extraction Rationale
We extracted `JobStatusBadge` to adhere to the Single Responsibility Principle. `JobCard`'s primary responsibility is to lay out the information of a job. It shouldn't also have to contain the complex business logic of mapping employment types to specific color dictionaries and deciding when an "Expired" badge should appear. Extracting this logic into `JobStatusBadge` makes `JobCard` cleaner and allows the badge logic to be reused elsewhere (like a Job Details page).

### 10. Effect Responsibilities Table

| Effect Purpose | Dependency Array | When It Runs | Why Merging Breaks the App |
| :--- | :--- | :--- | :--- |
| **Read from Storage** | `[]` (Empty) | Exactly once, only when the `Home` component first mounts. | If merged, the read logic would run every time the state changes. It would immediately overwrite the user's new selection by reading the old, stale ID back out of `sessionStorage` before the new one could be saved. |
| **Write to Storage** | `[selectedId]` | Whenever `selectedId` changes (after the initial mount). | If merged, it would be impossible to satisfy both timing requirements. A missing dependency array runs on every single render (causing infinite loops or performance issues), and an empty one never saves updates. |

---

# CareerHub Frontend - Assignment 1.3

## Part 1: Conceptual Questions

### 1. Server State vs Client State
**Server State** is data that lives on an external server and doesn't belong to the UI directly (e.g., the list of jobs from the database). It requires asynchronous fetching and can become outdated.
**Client State** is temporary data that belongs entirely to the local application (e.g., `selectedId` remembering which card you clicked, or a dark mode toggle). It is instantaneous and disappears when you close the tab.

### 2. The queryKey Contract
The `queryKey` (like `["jobs"]`) acts as a unique identifier for the data cache. Whenever we use the same key across different components, TanStack Query knows it's the exact same data and instantly shares the cached result instead of making duplicate network requests.

### 3. Why fetch does not throw on HTTP errors
The native `fetch` API is designed to only throw an error if there is a total network failure (like the user losing internet). If the server successfully receives the request and replies with a `404 Not Found` or `500 Server Error`, `fetch` considers the request completed successfully. We must manually check `res.ok` to throw our own error.

### 4. Stale-while-revalidate
This is a caching strategy that prioritizes speed. When you request data, the app instantly shows you the old, cached data (the "stale" data) so you aren't stuck waiting. Behind the scenes, it silently makes a network request to get the fresh data (the "revalidate" step) and swaps it in seamlessly once it arrives.

## README Updates

### 1. What TanStack Query Manages
Instead of us manually writing `useState` and `useEffect` to handle loading spinners, error messages, and storing data, TanStack Query manages all of this asynchronously. It gives us simple booleans like `isPending` and `isError` while it handles caching, deduping identical requests, and background refetching automatically.

### 2. The queryKey Design Decision
We use an array `["jobs"]` for the query key because it establishes a scalable pattern. If we later want to fetch jobs for a specific city, we can simply update the key to `["jobs", { location: "Pretoria" }]`. TanStack Query uses this array structure to intelligently organize and separate different caches.

### 3. Skeleton Design Rationale
We designed the `JobCardSkeleton` to exactly mirror the visual structure (headings, badges, layout) of the real `JobCard`. This prevents "Cumulative Layout Shift" (CLS)—a jarring experience where the page jumps around when the real data finally loads. We render exactly 6 skeletons because it perfectly fills our responsive 3-column grid, making the app look complete while loading.

### Final Build Output
```text
> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 2.5s
  Running TypeScript ...
  Finished TypeScript in 1003ms ...
  Collecting page data using 6 workers ...
  Generating static pages using 6 workers (0/5) ...
  Generating static pages using 6 workers (1/5) 
  Generating static pages using 6 workers (2/5) 
  Generating static pages using 6 workers (3/5) 
✓ Generating static pages using 6 workers (5/5) in 155ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /api/jobs


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## Assignment 1.4: Application Form & Optimistic UI

### Part 1: Conceptual Answers

1. **Why is `@hookform/resolvers` a separate package?**
   React Hook Form is designed to be completely library-agnostic. Instead of hardcoding Zod or Yup directly into the core library, they created a standard "resolver" function signature. A resolver is simply a function that takes your validation schema and returns a new function. This new function accepts the current form values, runs the schema validation, and returns either the clean values or the formatted errors. Because of this decoupled design, you can plug in *any* validation library just by using its specific resolver package!

2. **The HTML Number Input Problem & `z.coerce`**
   By default, HTML `<input type="number">` elements actually return their values as *strings* in the DOM (e.g., `"5"` instead of `5`). If Zod expects a strict `number`, it will fail validation because a string is not a number. By using `z.coerce.number()`, we tell Zod to actively try parsing the incoming string into an integer *before* validating it. The final TypeScript type inferred by Zod is still a strict `number`, which keeps our frontend data perfectly clean!

3. **`mutate` vs `mutateAsync` with `isSubmitting`**
   React Hook Form's `handleSubmit` function expects you to return a Promise so it knows exactly how long the submission is taking (which keeps `isSubmitting` set to `true`). 
   - If we use `mutate`, it returns `void` (nothing) immediately, meaning `handleSubmit` thinks the submission finished instantly and sets `isSubmitting` back to `false` prematurely!
   - If we use `mutateAsync`, it returns a *Promise*. `handleSubmit` will wait for this Promise to resolve or reject, keeping `isSubmitting` accurately set to `true` for the entire duration of the API call.

4. **`onSuccess` Placement (Option A vs Option B)**
   - **Option A (Global):** Placing `onSuccess` or `onSettled` directly inside the `useMutation({ ... })` configuration applies it *globally* to the mutation. Whenever this mutation fires, regardless of how or where, this callback runs. We use this for invalidating the cache (`queryClient.invalidateQueries`) because cache synchronization should happen globally across the app.
   - **Option B (Local):** Placing `onSuccess` inside the actual `.mutateAsync(data, { onSuccess: ... })` call makes it fire *locally* only for that specific instance. 

### Part 6: Technical Explanations

- **Schema Design Decisions:** We used standard string validations for `fullName` and `email`, but specifically utilized `.or(z.literal(""))` alongside `.optional()` for optional fields like `phone` and `linkedInUrl`. This ensures that if a user leaves the input completely blank (an empty string), Zod correctly interprets it as undefined rather than failing validation.
- **The Cross-Field Refine:** To handle the relationship between `availableImmediately` and `noticePeriodWeeks`, we chained a `.refine()` to the end of our Zod object. This rule explicitly states: "Either you are available immediately, OR your notice period must be greater than 0." If this fails, the error message is specifically routed to the `noticePeriodWeeks` field path so the red text appears precisely under that input.
- **The Two Loading Flags:** `isSubmitting` tracks the exact moment the user clicks the submit button while React Hook Form runs validation and fires the Promise. `mutation.isPending` tracks the actual network lifecycle of the API call via TanStack Query. By combining them (`isBusy = isSubmitting || mutation.isPending`), we guarantee the submit button stays fully disabled for the absolute entire lifecycle of the user interaction.

### Production Build Output
```
> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 2.1s
  Running TypeScript ...
  Finished TypeScript in 1118ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/6) ...
  Generating static pages using 7 workers (1/6) 
  Generating static pages using 7 workers (2/6) 
  Generating static pages using 7 workers (4/6) 
✓ Generating static pages using 7 workers (6/6) in 170ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/applications
└ ƒ /api/jobs


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

# CareerHub Frontend - Assignment 2.1

## Part 1: Conceptual Answers

### 1. `cache: "no-store"` vs Default
By default, Next.js App Router aggressively caches data fetches in Server Components (using `force-cache`). This means the data is fetched once at build time or on the first request, and all subsequent users see that stale data indefinitely until the cache is manually invalidated. By specifying `cache: "no-store"`, we tell Next.js to skip the cache completely and fetch fresh data directly from the API on every single request.

### 2. The `"use client"` Boundary
The `"use client"` directive defines the "Client Boundary". Anything above this boundary (Server Components) runs exclusively on the server and has no access to the browser, React state (`useState`), or hooks (`useEffect`). When you place `"use client"` at the top of a file, that component and all its children become Client Components. These components are hydrated in the browser, allowing them to use interactive React features and browser APIs.

### 3. Why `params.id` is a String
In a web URL (e.g., `/jobs/123`), every segment of the path is fundamentally just text. The browser and the routing engine have no concept of types—they just parse strings separated by slashes. Therefore, Next.js always provides route parameters as strings. If your database uses integer IDs, you must manually parse the string (`parseInt(params.id)`) before querying the database.

### 4. What "Layout Persists" Means
When you navigate between pages that share the same `layout.tsx` (like moving from `/dashboard` to `/dashboard/listings`), Next.js only replaces the `children` prop. The layout component itself does not unmount or re-render from scratch. This means any state inside the layout (like an open sidebar toggle) is preserved, and the browser doesn't have to reload those DOM elements, making navigation significantly faster.

## README Updates

### 1. Composition in `/jobs/[id]`
We used the composition pattern by placing the interactive `<ApplicationForm>` (a Client Component) directly inside the `page.tsx` (a Server Component). Because the Server Component fetches the data, it simply passes the `jobId` and `jobTitle` as props to the Client Component. This keeps the data fetching fast and secure on the server, while still allowing the form to handle complex user interactions and state in the browser.

### 2. Why `JobLinkCard` has no `"use client"`
`JobLinkCard` is entirely static—it only receives data via props and uses the native Next.js `<Link>` component. It has no need for `useState`, `useEffect`, or DOM event listeners (like `onClick`). By leaving out `"use client"`, it remains a Server Component, meaning its JavaScript is never shipped to the browser, reducing the bundle size and improving performance.

### 3. `loading.tsx` vs Manual Loading State
Instead of manually defining `const [isLoading, setIsLoading] = useState(true)` and conditionally rendering a spinner, we used `loading.tsx`. Next.js automatically intercepts the navigation, immediately displays the UI from `loading.tsx`, and waits for the Server Component's `await fetch(...)` to complete in the background. Once the data is ready, Next.js automatically swaps the loading UI for the real page UI, completely removing the need for manual state management.

### Final Build Output
```text
> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 1586ms
  Running TypeScript ...
  Finished TypeScript in 1214ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/8) ...
  Generating static pages using 7 workers (2/8) 
  Generating static pages using 7 workers (4/8) 
  Generating static pages using 7 workers (6/8) 
✓ Generating static pages using 7 workers (8/8) in 102ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/applications
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /dashboard/listings
├ ƒ /jobs
└ ƒ /jobs/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

# CareerHub Frontend - Assignment 2.2

## Part 1: Conceptual Answers

### 1. Choosing a cache strategy per data source
When we built our public facing job listings (`/jobs`), it made sense to cache the results because job data changes infrequently and is identical for every user. However, for a logged-in employer looking at `/dashboard/listings` or reviewing real-time applicant stats, they need immediate, up-to-the-second accuracy. A generic cache strategy fails here; we must choose caching based on the *consumer's* needs (employer vs public) and the *volatility* of the data. By using `next: { tags: ["jobs"] }`, we get the best of both worlds: we cache the data for speed, but retain the ability to instantly bust that cache across the entire application the moment a job status changes.

### 2. Why revalidateTag works across routes
Unlike `revalidatePath` which only clears the cache for a specific URL, `revalidateTag` acts globally. Because we attached the `"jobs"` tag directly to our `fetch()` calls, that tag is permanently associated with that specific data chunk in the Next.js Data Cache, regardless of which route or component actually triggered the fetch. When our Server Action calls `revalidateTag("jobs")`, Next.js hunts down every single cached response in the system holding that tag and purges them simultaneously. The next time a user navigates anywhere relying on that data, they are guaranteed to receive fresh data.

### 3. What Promise.all failure means
`Promise.all` operates on a strict "fail-fast" principle. If we trigger two fetches simultaneously (jobs and stats), and the stats fetch fails while the jobs fetch succeeds, the entire `Promise.all` immediately throws an error and rejects. The success of the jobs fetch is discarded. In our `ListingsTable`, this means if the stats API goes down, the entire table crashes and triggers the nearest `error.tsx` boundary, even if the jobs data was perfectly healthy.

### 4. The two-boundary vs one-boundary trade-off
If we wrapped both `<ApplicationsSummary />` and `<ListingsTable />` in a single `<Suspense>` boundary, the user would be forced to stare at a skeleton until *both* components finish their data fetching. By giving them independent boundaries, they stream in exactly when they are ready. The summary card might appear in 100ms, giving the user immediate value, while the table's skeleton spins for another 2 seconds. The trade-off is visual consistency: independent boundaries can cause visual "pop-in" as elements load at different times, whereas a single boundary ensures the UI updates all at once in a cohesive visual block.

## README Updates

### 1. Tracing the close action end to end
1. **The Click:** The user clicks "Close" on the `CloseJobButton`.
2. **Optimistic UI:** `useOptimistic` instantly intercepts the click, changing its internal state to `false`, causing the button to immediately disappear from the screen so the UI feels lightning fast.
3. **The Server Action:** Behind the scenes, the browser sends a POST request containing the `jobId` form data to our `closeJobListing` Server Action.
4. **The Database:** The Server Action executes on the server, parsing the ID and sending a `PATCH` request to the live C# backend to permanently update the database.
5. **Cache Invalidation:** Upon a successful C# response, the Server Action calls `revalidateTag("jobs")`, purging the stale jobs data from the Next.js cache.
6. **The Re-render:** Because a Server Action mutated data, Next.js automatically triggers a re-render of the current route. The `<ListingsTable>` re-runs its fetch, retrieves the fresh (now closed) job from the API, and streams the updated HTML back to the browser.

### 2. Why two Suspense boundaries are better than one here
In our dashboard, the `<ApplicationsSummary />` fetches a tiny, lightweight JSON object of stats. The `<ListingsTable />` fetches a much larger payload of all jobs and their descriptions, plus the stats, and performs array mapping. By wrapping them in two separate boundaries, the summary card can render and stream to the browser almost instantly, providing immediate value and interactivity to the user, without being artificially delayed by the slower, heavier table query.

### 3. The self-contained component trade-off
By moving the data fetching directly inside `<ListingsTable>` and `<ApplicationsSummary>`, we created "self-contained" components. 
**Pros:** They are highly reusable; you can drop `<ListingsTable>` onto any page and it "just works" because it fetches its own data. The parent page code is incredibly clean.
**Cons:** We lose centralized control over data fetching. If the parent page and three different self-contained components all happen to fetch the exact same `/api/v1/jobs` endpoint, Next.js will deduplicate them, but it becomes harder for a developer to look at a page and easily understand all the network requests it is making. It also risks waterfall requests if these components are nested inside each other rather than rendered in parallel.

### 4. Stretch B: Granular Cache Tags
We tagged the individual job fetch with `next: { tags: ["jobs", "job-[id]"] }`. 
We need the global `"jobs"` tag so that if a massive system-wide event occurs (e.g., an admin clicks "Archive All Jobs"), a single `revalidateTag("jobs")` clears every single job-related cache across the entire site instantly.
However, we need the specific `"job-[id]"` tag for precision. When a user closes *one specific job* using our action, we want to invalidate that single job's detail page (`job-123`) without accidentally purging the cache for the hundreds of other perfectly valid job detail pages. This granular tagging gives us surgical precision over cache invalidation, maximizing cache hit rates and minimizing unnecessary API load.

### Final Build Output
```text
> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 1670ms
  Running TypeScript ...
  Finished TypeScript in 1288ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/9) ...
  Generating static pages using 7 workers (2/9) 
  Generating static pages using 7 workers (4/9) 
  Generating static pages using 7 workers (6/9) 
✓ Generating static pages using 7 workers (9/9) in 153ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/applications
├ ƒ /api/applications/stats
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /dashboard/listings
├ ○ /jobs
└ ƒ /jobs/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

# CareerHub Frontend - Assignment 2.3

## Part 1: Conceptual Answers

### 1. Mapping CareerHub roles to route protection rules
Our application has two primary roles: `employer` and `candidate`. The route protection rules enforce this separation:
- `/dashboard/*` routes are exclusively for employers. If a candidate tries to access them, they are redirected.
- `/jobs/*` routes are public, but the application form inside them is restricted to candidates (or forces sign-in for guests). Employers are explicitly blocked from applying to jobs.
- `/login` is protected against already authenticated users, redirecting them to their respective home pages based on their role to prevent unnecessary login attempts.

### 2. The session object design
NextAuth's default session object only includes basic information (name, email, image). We used TypeScript module augmentation in `next-auth.d.ts` to extend the `Session`, `User`, and `JWT` types to explicitly include an optional `role` string. This allows us to safely pass the user's role from the JWT token directly into the session object during the `session` callback, making `session.user.role` securely and globally accessible across our application.

### 3. Choosing the state tool for job filters
We chose URL state (via `nuqs`) for job filters instead of local React state or global Zustand state. URL state allows the filters to be shareable via a link (e.g., sending a link to a friend with `?status=open`), preserves the user's search criteria if they refresh the page, and integrates perfectly with Next.js Server Components which can read the `searchParams` directly for server-side filtering or fetching.

### 4. What the nav bar knows
The navigation bar (`NavLinks`) is a Client Component that receives the user session data as a prop. It uses this knowledge to dynamically render links. If the user is an employer, it renders the "Dashboard" link and an employer badge. If a candidate, it renders the "Jobs" link and a candidate badge. It also conditionally renders either a "Sign In" link or the authenticated user's name alongside a "Sign Out" button.

## Part 12: Technical Explanations

### 1. The role redirect decision
Inside our login Server Action, we purposefully set `redirect: false` when calling NextAuth's `signIn`. This prevents NextAuth from immediately redirecting the user to a default page. Instead, it allows the Server Action to continue executing, fetch the newly created session via `auth()`, examine the user's `role`, and manually execute a Next.js `redirect()` to either `/dashboard/listings` for employers or `/jobs` for candidates.

### 2. Middleware vs page-level guards
Middleware runs at the edge *before* a request even hits the Next.js routing engine or renders a page. This makes it incredibly fast and perfect for broad, route-level protection (e.g., blocking all `/dashboard` access). Page-level guards (checking `auth()` inside a Server Component) are better for granular UI decisions, like deciding whether to render a specific button or form on a page that is otherwise public.

### 3. Why URL state for job filters
URL state acts as the ultimate "source of truth" that bridges client interactivity and server rendering. By using `nuqs`, as the user types in the search box, the URL instantly updates. Because Next.js Server Components (like our `JobsPage`) can read `searchParams`, the server instantly knows the user's filter preferences and can pre-filter the jobs array before sending the HTML to the client, combining the speed of client-side interactions with the power of server-side data processing.

### 4. The async Server Component / store boundary
Zustand is a pure Client State management tool; its hooks cannot run inside Server Components. Our `ListingsTable` required both server-fetched data and Zustand's layout preferences. We solved this boundary by extracting the data fetching into a Server Component wrapper (`ListingsDataWrapper`). This wrapper awaits the data, then passes it down as props to a thin Client Component wrapper (`DashboardClientWrapper`), which successfully reads the Zustand store and renders the final UI.

### Stretch A: Defense in Depth
Inside `ListingsTable.tsx`, we added a check to ensure `session?.user?.role === "employer"` before rendering the `CloseJobButton`. While Middleware already blocks non-employers from the dashboard, this is "Defense in Depth"—adding a secondary, component-level check to ensure that even if the middleware fails or the component is accidentally reused on a public page, unauthorized users will never even see the sensitive UI controls.

### Stretch B: Zustand Persist & The Hydration Mismatch
We used Zustand's `persist` middleware to save the dashboard layout preferences (Grid vs Table) to the browser's `localStorage`. However, `localStorage` only exists in the browser. During the initial Server Side Render (SSR), Next.js cannot read `localStorage`, so it assumes the default state (Table view) and generates HTML for a table. When that HTML reaches the browser, Zustand instantly reads `localStorage` and realizes the user actually wants Grid view. If React immediately swapped them, the UI would flash and React would throw a "Hydration Mismatch" error because the server HTML didn't match the client HTML. We fixed this by rendering a skeleton or `null` until the component confirms it has `mounted` on the client.

### Final Build Output
```text
> careerhub-frontend@0.1.0 build
> next build

▲ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...
✓ Compiled successfully in 2.1s
  Running TypeScript ...
  Finished TypeScript in 1299ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/10) ...
  Generating static pages using 7 workers (2/10) 
  Generating static pages using 7 workers (4/10) 
  Generating static pages using 7 workers (7/10) 
✓ Generating static pages using 7 workers (10/10) in 70ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /api/applications
├ ƒ /api/applications/stats
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/jobs
├ ƒ /api/jobs/[id]
├ ƒ /dashboard/listings
├ ƒ /jobs
├ ƒ /jobs/[id]
└ ƒ /login


ƒ Proxy (Middleware)

ƒ  (Dynamic)  server-rendered on demand
```