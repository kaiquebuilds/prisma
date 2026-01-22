# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Prisma Finance web application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ recommended approach)
- **Server-side tracking** with a dedicated PostHog Node.js client for API routes
- **Reverse proxy configuration** to improve tracking reliability and bypass ad blockers
- **Event tracking** for key user interactions (link clicks, API requests, errors)
- **Error tracking** integrated alongside existing Sentry error monitoring

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `clicked_deploy_now` | User clicked the Deploy Now button to deploy to Vercel | `src/app/page.tsx` |
| `clicked_documentation` | User clicked the Documentation button to view Next.js docs | `src/app/page.tsx` |
| `clicked_templates_link` | User clicked the Templates link in the description | `src/app/page.tsx` |
| `clicked_learning_link` | User clicked the Learning center link in the description | `src/app/page.tsx` |
| `api_proxy_request` | Server-side event tracking API proxy requests with method and path | `src/app/api/proxy/[...path]/route.ts` |
| `api_proxy_error` | Server-side event tracking when API proxy encounters an error | `src/app/api/proxy/[...path]/route.ts` |
| `api_client_error` | Client-side event tracking when API client encounters an error | `src/lib/api/client.ts` |
| `global_error` | Client-side event tracking when a global error occurs | `src/app/global-error.tsx` |

## Files Modified/Created

| File | Change Type | Description |
|------|-------------|-------------|
| `src/instrumentation-client.ts` | Modified | Added PostHog client-side initialization |
| `next.config.ts` | Modified | Added PostHog reverse proxy rewrites |
| `src/lib/posthog-server.ts` | Created | Server-side PostHog client singleton |
| `src/app/page.tsx` | Modified | Converted to client component with click event tracking |
| `src/app/api/proxy/[...path]/route.ts` | Modified | Added server-side API request/error tracking |
| `src/lib/api/client.ts` | Modified | Added client-side API error tracking |
| `src/app/global-error.tsx` | Modified | Added PostHog error capture alongside Sentry |
| `.env` | Modified | Added PostHog environment variables |
| `.env.example` | Modified | Added PostHog environment variable placeholders |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/296233/dashboard/1111643) - Main dashboard with all insights

### Insights
- [Homepage Link Clicks](https://us.posthog.com/project/296233/insights/TrdOTPVB) - Tracking clicks on Deploy Now, Documentation, Templates, and Learning links
- [API Proxy Activity](https://us.posthog.com/project/296233/insights/NwufJuqK) - Server-side tracking of API proxy requests and errors
- [Error Tracking](https://us.posthog.com/project/296233/insights/D6m1bK3X) - Client-side and global error events
- [Deploy Now Conversion Funnel](https://us.posthog.com/project/296233/insights/qxQJAan9) - Funnel tracking users from viewing homepage to clicking Deploy Now
- [API Request Methods Breakdown](https://us.posthog.com/project/296233/insights/gj0d7JrD) - Breakdown of API proxy requests by HTTP method

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure the following environment variables are set in your deployment environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```
