# End-user testing and fixes — 28 September 2026

## Scope and result

Tested the current frontend and backend locally as a parent, tutor and admin using Chromium. Mutating browser tests used a separate SQLite database and real HTTP/authentication/API routes on ports 15173/18001. Your existing database and accounts were not used for test mutations. The running app at localhost:5173 and API at localhost:8000 also passed read-only health/public-discovery checks.

The earlier messaging test covered the inbox composer but missed the tutor profile's separate Send action. This pass reproduced that action returning HTTP 404, then verified the complete profile → conversation → reply journey after fixing it. Admin actions were exercised against real test records, rather than the visual-only fixture used during the redesign.

Final checks: **21 backend tests pass**, frontend production build passes, and `git diff --check` passes. Changes are local and uncommitted; no push or deployment was performed.

## Confirmed issues and fixes

| Area | Reproduced issue | Fix and verification |
| --- | --- | --- |
| Profile messaging | Message → Send posted to the nonexistent `/api/messages` endpoint and returned 404. | Creates/reuses a conversation, sends through its message endpoint, then opens that inbox thread. Browser send and receipt passed. |
| Incoming messages | An open chat did not fetch replies after its initial load. | Refreshes conversations/messages every four seconds while visible and on focus; handles read status. Two-browser reply test passed without reload. |
| Compose recipient | Clicking a search result immediately created a conversation; submitting a partial email could select the first matching account. | Selection now fills the recipient field. Submission requires the chosen recipient or an exact email. Browser selection and partial-email rejection passed. |
| Chat reliability | Failed loads appeared empty; rapid Enter presses could duplicate sends; delayed responses could affect the wrong thread. | Visible retry states, preserved drafts, a send lock and response-version guards. Failure/retry and rapid Enter tests passed. |
| Conversation access | SQLite JSON `contains` matched user ID 1 against participants 10/11, exposing another conversation's metadata and last-message preview. | Exact JSON membership and participant checks for read updates. Regression test reproduces the old exposure and now passes. |
| Conversation ordering/time | `last_message_at` was assigned before the message default timestamp existed. SQLite UTC dates appeared as local time. | Flushes before updating the timestamp; older conversations fall back to their last message time; UTC parsing corrected in chat. Regression and browser checks passed. |
| Admin navigation | Header/mobile Messages links led to a route disallowed for admins. Saved/learning links were also shown for the wrong role. | Admin Messages opens the existing admin conversation tab; inappropriate account-menu links are hidden. Direct route, mobile menu and logout checks passed. |
| Admin loading | Failed requests were silently swallowed; transcript failures looked like empty chats. | Section errors, dashboard refresh and transcript refresh/retry controls. Injected failures recovered in browser tests. |
| Admin deletion/decline | Hard deletion missed dependent favorites, applications, sessions, questions, reports and conversations; populated records could fail or become orphaned. Decline deleted teaching profiles referenced by history. | Dependency-aware deletion with rating recalculation; decline disables the account and hides its profile while preserving history. Foreign-key-enabled parent/tutor deletion tests pass; populated parent deletion also passed through the UI. |
| Disabled accounts | Role-only checks trusted an old token without checking whether the account remained active. Disabled tutors remained publicly discoverable. | Role guards verify the current active account; public search/detail hide disabled tutors. Deactivate → session invalidation → reactivate/login passed. Self-deactivation is blocked by the API. |
| Admin details/UI | Review cards showed unrelated user statistics and contained a hard-coded rating fallback. Admin creation hid its success message. Overview/AI settings overflowed at 320px. | Real review count/average, persistent creation feedback, wrapping cards/settings. New admin creation/login and all eight tabs at four widths passed. |
| Parent applications | Tutors could apply, but parents had no application review/accept/reject or close controls. | Connected those controls to the existing APIs. Parent acceptance and closing a requirement passed. |
| Lesson logging | The session API existed, but tutors had no UI to log lessons. | Added a session form for accepted requirements. Saved lesson appeared in the parent's learning page. Blank topics and nonpositive durations are rejected. |
| Learning questions | Asking before the first lesson failed despite an existing requirement; tutors saw parent-only question controls. Provider errors were stored as successful answers. | Uses the displayed requirement context, limits question controls to parents, and returns a retryable error without saving a failed answer. Pre-lesson question/history passed with a test provider; provider-failure regression passes. |
| Saved tutors/photos | Profile read `is_favorited` while API returned `is_favorite`; uploaded photos were not rendered on profile/dashboard. | Correct favorite state and shared photo preview with initials fallback. Save/reload and upload/render checks passed. |
| Contact/fees | Contact failure showed only a generic alert. Zero fees could become blank/negotiable when loading or displaying data. | Inline delivery errors retain the contact draft; zero values use null checks instead of truthiness. Contact failure/retry presentation verified without sending email. |

## Browser coverage

- Parent and tutor registration/login, tutor profile save, admin tutor approval, public tutor profile, favorites, photo upload, review and report submission.
- Profile message, inbox compose, incoming replies, mobile back navigation, duplicate-send prevention, failed-send draft retention, inbox load recovery and admin transcript recovery.
- Requirement posting, tutor application, parent acceptance, tutor lesson recording, parent session visibility, question/history UI and requirement closure.
- Admin overview, categories, applications, requirements, reviews, users, AI settings and messages. Category create/edit/delete, admin creation/login, account activate/deactivate and populated parent deletion were exercised through the UI. Decline and self-deactivation denial were additionally exercised through authenticated HTTP and regression tests.
- Active chat and role pages at **320, 390, 768 and 1440px**. All eight admin tabs fit these widths after repairs. Tables/tabs retain their intended internal horizontal scrolling.
- Role restrictions and logout; public navigation and contact failure state.

## Remaining gaps and limits

1. **Real AI providers and email delivery are not verified by this pass.** AI answers were stubbed only at the provider boundary, and email was disabled in the isolated instance. The admin connection test correctly reports a missing test API key. Validate your actual provider configuration and SMTP delivery separately before release; this result does not imply your main instance lacks keys.
2. **Reports are stored, but there is no admin report-review queue.** The next product fix is a reports tab with review/resolution actions; reporting currently provides no complete moderation workflow.
3. **Certificate upload has an API but no tutor upload/admin review interface.** Profile-photo upload is tested; certificate verification remains incomplete.
4. **Learning questions use the latest active requirement.** A parent with multiple children needs an explicit requirement selector to choose a different learning context.
5. This is a functional local audit, not exhaustive security/load testing or production verification. PostgreSQL-specific JSON membership code was not exercised; regressions use the app's local SQLite database type. No deployment, external email, real payment or calendar booking was tested.

## Evidence

- [Backend results](test-evidence/backend-tests.txt)
- [Frontend build](test-evidence/frontend-build.txt)
- [Completed browser checks](test-evidence/completed-browser-checks.json)
- [Mobile messaging checks](test-evidence/mobile-messaging-checks.json)
- [Admin responsive checks](test-evidence/admin-layout-checks.json)
- [Mobile conversation screenshot](test-evidence/mobile-chat.png)
- [Admin conversation screenshot](test-evidence/admin-chat.png)

Regression tests are in `backend/tests/test_messaging_admin_regressions.py`. Run `python -m unittest discover -s tests` from `backend`, and `npm run build` from `frontend`.

The isolated audit servers were stopped and their database/login state plus the test photo were removed after testing. Your original local frontend/backend remain running.
