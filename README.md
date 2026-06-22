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