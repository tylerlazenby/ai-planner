# AI Agent Guidelines for AI Planner

## Architecture Overview

This is a Next.js 16 application using the App Router with Prisma ORM and MongoDB. The app integrates OpenAI GPT-4 for AI-powered daily planning.

**Core Data Model:**
- `Plan`: Daily schedule with date, AI-generated explanation, and associated tasks
- `Task`: Individual activities with title, description, time slots, priority, and completion status

**Key Flows:**
- User inputs tasks via drag-and-drop interface in `/create-plan`
- OpenAI processes tasks to generate optimized schedule with timings and priorities
- Plans stored in MongoDB via Prisma, displayed in timeline and list views
- Task completion managed with optimistic UI updates via React Context

## Development Workflow

**Setup:**
```bash
npm install  # Runs prisma generate, db push, and seed automatically
npm run dev  # Uses Turbopack for fast development
```

**Database:**
- `npm run studio` launches Prisma Studio for DB inspection
- Schema uses MongoDB with ObjectId fields
- Seeding creates sample plans for last 7 days plus today

**Key Commands:**
- `npm run build` for production build
- `npm run lint` for ESLint checks
- Server actions automatically revalidate affected pages after mutations

## Project Conventions

**State Management:**
- React Context (`TaskProvider`) for task state with optimistic updates
- Server actions handle all database mutations
- `revalidatePath()` used for cache invalidation after DB changes

**Time Handling:**
- Times stored as "HH:MM" strings (24-hour format)
- Display converted to 12-hour format with `date-fns`
- Date ranges use UTC for consistent querying

**Priority System:**
- Tasks prioritized by drag order in UI (top = highest priority)
- AI assigns priorities: first 1/3 = HIGH, middle 1/3 = MEDIUM, last 1/3 = LOW
- Visual indicators: high priority gets left border accent

**UI Patterns:**
- shadcn/ui components with Tailwind CSS v4
- Lucide icons throughout
- Responsive grid layouts with mobile-first approach
- Dark/light theme support via next-themes

**File Organization:**
- Server components in `app/` for data fetching
- Client components in `components/` for interactivity
- Actions in `actions/` or page-specific `actions/` folders
- Shared UI components in `components/ui/`

**Data Fetching:**
- Server components fetch data directly from Prisma
- `force-dynamic` and `revalidate = 0` for real-time data
- Include relations in Prisma queries (e.g., `include: { tasks: true }`)

**AI Integration:**
- OpenAI GPT-4 with structured JSON prompts
- System prompt defines exact response format
- Tasks enriched with descriptions, timings, and durations
- Explanation generated for scheduling rationale

## Common Patterns

**Optimistic Updates:**
```typescript
// In context: update UI immediately, then sync with server
setTasks(tasks.map(task => task.id === taskId ? {...task, completed: !currentStatus} : task))
startTransition(async () => {
  const result = await toggleTaskCompletion(taskId, currentStatus)
  if (!result.success) revertOptimisticUpdate()
})
```

**Server Action Structure:**
```typescript
'use server'
export async function actionName(params) {
  const prisma = new PrismaClient()
  // DB operations
  revalidatePath('/affected-route')
  return { success: true }
}
```

**Date Queries:**
```typescript
// Today's plan: range query with UTC dates
const startOfToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
const plan = await prisma.plan.findFirst({
  where: { date: { gte: startOfToday, lt: startOfTomorrow } }
})
```

**Drag and Drop:**
- Uses @dnd-kit with sensors for keyboard/mouse/touch
- `arrayMove` for reordering arrays
- `SortableContext` with vertical list strategy

**Error Handling:**
- Server actions return `{ success: boolean, error?: string }`
- Client catches and handles failures, reverting optimistic updates
- Console logging for debugging (remove in production)</content>
<parameter name="filePath">C:\Users\lazen\WebstormProjects\ai-planner\AGENTS.md
