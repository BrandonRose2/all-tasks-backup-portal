# Catalog Reconciliation: Uploaded Draft vs. Published Catalog

The uploaded `projects.json` is treated as the proposed source of truth. No project data has been changed or published during this audit.

| Catalog | Project count |
|---|---:|
| Published | 22 |
| Uploaded draft | 19 |

## Projects removed by the uploaded draft

| Slug | Title |
|---|---|
| `propertymax-ai` | PropertyMax.ai |
| `inventory-qr` | Inventory QR |
| `piano-mastery` | Piano Mastery |
| `peptides-webapp` | Peptides WebApp |
| `team-workspace` | Team Workspace |
| `github-repos` | GitHub Repos |

## Projects added by the uploaded draft

| Slug | Title | URL |
|---|---|---|
| `new-hire-onboarding-portal` | New Hire/Onboarding Portal | https://new-hire-onboarding.manus.space/admin |
| `new-hire-onboarding-how-it-works-powerpoint` | New Hire Onboarding - How it Works Powerpoint | https://new-hire-onboarding-aptcorp.my.canva.site/ |
| `property-manager-feedback-training-request-app` | Property Manager Feedback & Training Request App | file:///Users/brandonrose/Downloads/PM_Feedback_Form_App.html |

## Existing projects modified by the uploaded draft

| Slug | Title | Changed fields |
|---|---|---|
| `vacancy-report` | Vacancy Report | `image`, `previewMode`, `previewStyle` |
| `loss-to-lease` | Loss to Lease | `subtitle` |
| `regional-data-collector` | Regional Data Collector | `image`, `previewMode`, `url` |
| `batch-file-editor` | Batch File Editor | `previewMode`, `url` |
| `new-hire-onboarding` | New Hire Onboarding | `image`, `previewMode`, `url` |
| `company-contacts` | Company Contacts | `image`, `previewMode`, `url` |

## Recovery recommendation

Replace the published `projects.json` with the uploaded draft only after explicit approval. This will preserve the six intentional removals, add the three new onboarding/feedback entries, and retain all URL/image edits in the uploaded backup.
