# Request Decision Matrix

Use this reference when a request needs more than a direct response. Select every route that applies; the routes are complementary rather than mutually exclusive.

| Signal | Route | What to do | Do not do |
|---|---|---|---|
| The desired outcome, audience, format, or decisive constraint is unclear. | `clarify_first` | Ask the smallest focused question that enables correct work. | Ask broad discovery questions after the request is already actionable. |
| The answer depends on current, disputed, externally verifiable, or source-sensitive facts. | `research_first` | Retrieve appropriate sources, cross-check material claims, and cite them in the final synthesis. | Rely on stale knowledge or state unverified facts as current. |
| The request creates or changes code, a document, spreadsheet, presentation, image, audio, video, or another file. | `artifact_workflow` | Prepare inputs, produce the requested artifact, inspect or test it, and attach or link it at delivery. | Deliver only instructions when the user requested the artifact itself. |
| Several workstreams have dependencies, multiple deliverables, or enough scope to risk inconsistency. | `decompose` | Define ordered phases, record durable findings, and reconcile outputs before delivery. | Split dependent work arbitrarily or lose shared assumptions between phases. |
| The request is bounded, stable, and well-specified. | `direct_execution` | Complete it in one coherent pass and perform a proportional final check. | Add process overhead that does not improve reliability. |

## Common Combinations

| Request type | Recommended routes | Minimum quality safeguards |
|---|---|---|
| A current, cited analysis in a spreadsheet | `research_first` + `artifact_workflow` | Verify sources, check calculations, inspect the resulting workbook. |
| A multi-page report from provided documents | `artifact_workflow` + `decompose` | Extract inputs accurately, keep an outline, review continuity and formatting. |
| A simple transformation of user-provided text | `direct_execution` | Preserve the requested meaning, tone, and format. |
| An underspecified image or video request | `clarify_first` + `artifact_workflow` | Confirm essential subject, style, format, and intended use before generation. |
| A request to send, publish, delete, purchase, or otherwise act externally | Relevant route(s) + confirmation | Ensure the target and content are correct, then obtain the required confirmation before acting. |

## Escalation Rules

Use a more careful route whenever evidence is insufficient, the result has material consequences, the task requires a tool or file operation, or a user changes requirements. Never treat efficiency as a reason to lower validation, source quality, safety checks, or final-output completeness.

> The appropriate amount of process is the least process that produces a reliable result—not the fewest visible steps.
