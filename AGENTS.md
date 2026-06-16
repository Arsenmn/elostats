Prefer simplicity

Always choose the simplest solution that satisfies current requirements.

Do not introduce abstractions, generic layers, factories, wrappers, adapters, or configuration systems unless they solve an existing problem.

Avoid speculative architecture.

Follow YAGNI.

Readability over cleverness

Code is read far more often than it is written.

Prefer explicit code over compact code.

Prefer understandable code over clever code.

Future maintainers should understand the implementation without reading unrelated files.

Single Responsibility

Every class, service, hook, component, and utility should have one clear responsibility.

If a file is difficult to describe in a single sentence, it likely contains too many responsibilities.

Dependency Direction

High-level business logic must not depend directly on implementation details.

Business logic should not know about:

HTTP clients
localStorage
browser APIs
database details
external providers

These concerns should be isolated behind services.

Frontend Architecture Rules
Component responsibilities

Components should primarily handle:

rendering
user interaction
composition

Business logic should be extracted into:

hooks
module services
helper functions

Avoid large components containing rendering, fetching, transformation, filtering, and state management simultaneously.

State Management

Use the smallest state scope possible.

Order of preference:

Local component state
Context
Global store

Do not place state in global stores unless multiple unrelated parts of the application truly need it.

Derived State

Avoid storing derived state.

Prefer computing values from existing state.

Bad:

const [filteredPlayers, setFilteredPlayers] = useState([]);

Good:

const filteredPlayers = players.filter(...)
React Performance

Do not use:

useMemo
useCallback
React.memo

without measurable benefit.

Prefer readable code first.

Optimize only after identifying a bottleneck.

API Design Rules
Stable Contracts

Frontend must never depend directly on external provider responses.

Backend should map external APIs into stable DTOs.

Bad:

return faceitResponse;

Good:

return PlayerProfileDto;

This protects the frontend from provider changes.

Validation

Validate all incoming requests.

Use DTOs and class-validator.

Never trust client input.

Error Handling

Do not expose provider errors directly.

Convert external errors into application-specific exceptions.

Bad:

throw error;

Good:

throw new FaceitUnavailableException();
Backend Architecture Rules
Services

Services should contain business logic.

Controllers should:

validate requests
call services
return responses

Controllers should not contain business logic.

External Providers

FACEIT, Steam, OpenAI, and future integrations should each have dedicated provider services.

Example:

providers/
├── faceit
├── steam
├── openai

Business services should not perform raw HTTP calls.

Database Access

Prisma queries should be isolated.

Avoid spreading Prisma calls across many services.

Prefer repository-style abstractions when database access becomes complex.

AI Feature Architecture

Future AI features must remain isolated from domain logic.

Create dedicated modules:

modules/
├── ai-analysis
├── player-comparison
├── championship-analysis

AI services should consume structured player data.

AI services should not directly call FACEIT or Steam APIs.

Keep AI layers dependent on internal DTOs.

Code Review Standards

Before creating code, verify:

Is this the simplest solution?
Is this responsibility located in the correct layer?
Does this introduce unnecessary abstraction?
Can another developer understand this in 30 seconds?
Is the code consistent with existing project conventions?
Does this create future maintenance burden?
Refactoring Rules

When modifying existing code:

improve surrounding code when reasonable
reduce complexity where possible
remove dead code
remove duplicate logic
leave files cleaner than before

Do not perform large unrelated refactors.

Important Project-Specific Rules
backend-fastapi

The backend-fastapi directory is an educational sandbox.

Ignore it completely.

Never modify, refactor, analyze, or generate changes for it unless explicitly asked.

If a request involves backend-fastapi, first ask whether changes should be made there.
