# Temu Karir Front-End Rewrite

## Goal

Rewrite the existing public and admin user interfaces while preserving the product's current observable behavior, data contracts, SEO, and deployment model. This plan covers UI work. It does not authorize a database migration, backend rewrite, or a change to the authentication model.

## Scope

### Public experience

- Home page and company directory
- Company search, industry and ownership filters, and pagination
- Company detail pages and career-site links
- Company submission form
- Correction submission form
- Shared navigation, footer, theme behavior, and responsive layout

### Admin experience

- Admin login
- Company dashboard, search, status filtering, create, edit, delete, and validation
- Review and approval or rejection of company submissions
- Career-page discovery and discovery history

### Preserve

- Next.js App Router, React, TypeScript, Tailwind, existing component conventions, and Supabase integration
- Existing API routes and data shapes unless separately approved
- Public URLs, metadata, structured data, sitemap, robots behavior, and company slugs
- OpenNext/Cloudflare build and deployment support

### Excluded unless separately approved

- Database or schema changes
- Replacing Supabase or the current hosting platform
- Adding product features that are not present today
- Creating a logo, profile imagery, testimonials, statistics, or other new visual assets

## Confirmed product direction

- Audience: Gen Z fresh graduates looking for work
- Desired character: fresh, clear, and trustworthy
- This is a visual refresh, not a request to preserve the current visual system
- Provisional dials for design exploration: ENERGY 2 / RHYTHM 2 / MOTION 1

These are planning inputs, not a final design direction. Three initial visual proposals are available at `/design-preview` for owner selection or revision. Do not choose a palette or typeface by default. Obtain owner approval of a written design brief or `DESIGN.md` before implementing production UI. Any agent-proposed direction must be labeled as a proposal and approved by the owner first.

## Decisions and release gates

1. **Design direction:** approve palette, type choices, theme strategy, spacing and shape language, and any intended identity motif before visual implementation. Record one-line reasons for major choices.
2. **Admin authentication:** the current browser-side `tk_admin` localStorage marker is not sufficient evidence of server-side authorization. Confirm the trusted authentication and authorization mechanism with the owner before production release of admin pages. Do not represent a UI-only gate as secure.
3. **Demo and fallback data:** the directory and hero can fall back to local mock data. Decide whether to remove this fallback from the production experience or show it only as clearly labeled demo content. Never present mock values as verified company data or real statistics.
4. **Existing operations:** verify which admin operations and API routes are production-backed. Routes or mutations that return mock/stub behavior must be marked as blockers or handled in a separately approved backend task, not hidden by the rewrite.
5. **Navigation destinations:** confirm or remove links whose destinations do not exist, including the `Tentang` anchor and the footer GitHub placeholder.
6. **Theme support:** confirm whether to ship both light and dark themes. If both ship, verify both; if one theme is selected, record the reason and remove any misleading toggle.

## Work sequence

### Phase 1: Behavior baseline

Inventory each existing route, user-visible action, form field, filter, pagination rule, data source, metadata field, and admin operation. Record expected success, empty, loading, and error behavior. Capture the current build and note existing test coverage before UI changes.

### Phase 2: Owner decisions and design brief

Review and select or revise a concept in `/design-preview`, then resolve the decisions above that affect implementation. Produce an owner-approved design brief. Inspect current logo and imagery for reuse, but do not create or present new assets as final without approval.

### Phase 3: Shared UI foundation

Implement approved design tokens and shared page layout, navigation, footer, controls, dialogs, status messages, focus indicators, and responsive behavior. Keep keyboard behavior and contrast in scope from the start.

### Phase 4: Public pages

Implement the directory and company details, followed by submission and correction forms. Preserve route behavior and data contracts. Provide useful loading, empty, and error states, and ensure the visible data source is honest.

### Phase 5: Admin pages

Implement login, dashboard workflows, and discovery workflows against the verified current contracts. Do not ship the admin experience to production until the authentication release gate is resolved.

### Phase 6: Verification and rollout

Run the production build and available checks. Exercise every navigation item and control, verify public and admin flows, test keyboard-only access and supported themes, and check narrow mobile viewports for overflow or clipped content. Preserve a staged rollout path so public and admin changes can be diagnosed separately.

## Acceptance criteria

- Every existing in-scope route has been accounted for, with intentionally removed behavior approved by the owner.
- Search, filters, pagination, company detail navigation, submission, correction, and admin workflows retain their intended behavior.
- Every link and interactive control has a real destination or behavior.
- Data UIs provide loading, empty, and error states with useful next steps.
- No mock data, unverified statistics, fabricated claims, or fictional people are presented as real.
- The approved design brief is followed. The interface does not silently fall back to generic visual defaults.
- Supported breakpoints have no horizontal overflow or clipped content. Interactive controls meet accessible target sizes.
- Keyboard navigation and visible focus work across interactive elements. Text contrast meets WCAG AA.
- Light and dark themes both work if both are shipped.
- Existing SEO metadata, structured data, sitemap, robots behavior, and public URLs are retained or changes are approved.
- Build and available tests pass. Each interactive element has recorded click-through evidence, with console/runtime issues addressed.
- Admin production release is blocked until server-side authorization is verified.
- OpenNext/Cloudflare build and deployment checks remain valid.

## Initial codebase evidence

- Shared public layout and metadata are in `src/app/layout.tsx`; the home page composes `Hero` and `CompanyGrid`.
- Directory behavior is in `src/components/company-grid.tsx`; it queries Supabase and can fall back to local mock data.
- Company details are server-rendered at `src/app/perusahaan/[slug]/page.tsx`.
- Submission and correction forms call Supabase helpers directly.
- Admin login writes `tk_admin` to localStorage; dashboard and discovery pages check that browser value.
- `src/app/api/companies/route.ts` uses local data for reads and contains a placeholder create route. `src/app/api/validate/route.ts` contains commented-out persistence behavior. Verify current production use before changing these contracts.
- `src/components/navbar.tsx` links to `/#tentang`; `src/components/footer.tsx` includes a `#` destination. Verify and correct these as part of the navigation pass.
- The current root layout defaults to dark theme and enables system preference; confirm the intended theme behavior before carrying it forward.

## Risks

- Replacing UI without first recording behavior can drop non-obvious admin and form workflows.
- The client-side admin marker may be mistaken for authorization if the rewrite only changes the login appearance.
- Silent mock fallback can make stale or sample data appear authoritative.
- Direct Supabase mutations and placeholder API routes have different trust and failure behavior; UI changes must not mask this discrepancy.
- A new visual system without an approved brief risks producing generic styling instead of a product identity.
