# ApartmentCorp Employee Directory — Folder Map
**Created:** May 2026  
**Total Folders:** 285  
**Purpose:** Central file ecosystem for ApartmentCorp operations, HR, training, and compliance — to be housed on the company OneDrive/server.

---

## Design Logic

This folder structure is organized around **three core principles**:

1. **People first** — Every employee has a standardized file regardless of role, with role-specific subfolders for their unique responsibilities.
2. **Properties second** — Every building/property has its own self-contained folder with units, inspections, maintenance, leasing, financials, and assigned staff.
3. **Function third** — Company-wide functions (HR, IT, Finance, Compliance, Marketing) are centralized so nothing is buried inside a property or person folder.

---

## Full Folder Tree

```
ApartmentCorp Employee Directory/
│
├── 01 - Company Organization/
│   ├── 01 - Org Chart & Leadership/
│   │   ├── Company Org Chart
│   │   ├── Executive & Upper Management
│   │   └── Board & Ownership
│   ├── 02 - Upper Management/
│   │   ├── CEO
│   │   ├── COO
│   │   ├── CFO
│   │   ├── Director of Operations
│   │   └── Director of Leasing
│   ├── 03 - Regional Managers/
│   │   └── _Template - Regional Manager Folder/
│   │       ├── Employee File
│   │       ├── Performance Reviews
│   │       ├── Training Records
│   │       └── Assigned Properties
│   ├── 04 - Property Managers/
│   │   └── _Template - Property Manager Folder/
│   │       ├── Employee File
│   │       ├── Performance Reviews
│   │       ├── Training Records
│   │       └── Assigned Property
│   ├── 05 - Assistant Property Managers/
│   │   └── _Template - Assistant Manager Folder/
│   │       ├── Employee File
│   │       ├── Performance Reviews
│   │       └── Training Records
│   ├── 06 - Leasing Staff/
│   │   └── _Template - Leasing Agent Folder/
│   │       ├── Employee File
│   │       ├── Performance Reviews
│   │       ├── Training Records
│   │       └── Leasing Activity Logs
│   ├── 07 - Maintenance Staff/
│   │   └── _Template - Maintenance Tech Folder/
│   │       ├── Employee File
│   │       ├── Performance Reviews
│   │       ├── Training Records
│   │       ├── Certifications & Licenses
│   │       └── Work Order History
│   └── 08 - Accounting & Finance/
│       └── _Template - Accounting Staff Folder/
│           ├── Employee File
│           ├── Performance Reviews
│           └── Training Records
│
├── 02 - Properties & Buildings/
│   └── _Template - Property Folder/          ← Copy & rename for each property
│       ├── 01 - Property Overview/
│       │   ├── Property Info Sheet
│       │   ├── Floor Plans
│       │   ├── Site Maps
│       │   └── Photos
│       ├── 02 - Units/
│       │   ├── Unit Inventory
│       │   ├── Make-Ready Logs
│       │   ├── Unit Turn Records
│       │   └── Lease Abstracts
│       ├── 03 - Inspections/
│       │   ├── Move-In Inspections
│       │   ├── Move-Out Inspections
│       │   ├── Routine Inspections
│       │   ├── Annual Inspections
│       │   └── City & Code Inspections
│       ├── 04 - Maintenance & Work Orders/
│       │   ├── Open Work Orders
│       │   ├── Completed Work Orders
│       │   ├── Vendor Contacts
│       │   ├── Preventive Maintenance Schedule
│       │   └── Capital Improvements
│       ├── 05 - Leasing & Marketing/
│       │   ├── Availability Reports
│       │   ├── Rent Comparables
│       │   ├── Marketing Materials
│       │   ├── Ad Listings
│       │   └── Prospect Logs
│       ├── 06 - Financials/
│       │   ├── Monthly Reports
│       │   ├── Budget
│       │   ├── Rent Roll
│       │   ├── Delinquency Reports
│       │   └── Invoices & Vendor Bills
│       ├── 07 - Compliance & Legal/
│       │   ├── Fair Housing Records
│       │   ├── Permits & Licenses
│       │   ├── Insurance Certificates
│       │   └── Incident Reports
│       └── 08 - Staff Assigned to Property/
│           ├── Property Manager
│           ├── Assistant Manager
│           ├── Leasing Agents
│           └── Maintenance Technicians
│
├── 03 - Human Resources/
│   ├── 01 - New Hire Onboarding/
│   │   ├── Onboarding Forms & Templates/
│   │   │   ├── I-9 Employment Eligibility
│   │   │   ├── W-4 Federal Tax Withholding
│   │   │   ├── Direct Deposit Authorization
│   │   │   ├── Emergency Contact Form
│   │   │   ├── Employee Handbook Acknowledgment
│   │   │   ├── Background Check Authorization
│   │   │   └── Drug Test Authorization
│   │   ├── Completed New Hire Packets
│   │   ├── Offer Letters
│   │   └── Technology Onboarding (Ethan Fowler)/
│   │       ├── Credential Provisioning Records
│   │       └── Platform Access Logs
│   ├── 02 - Employee Files/
│   │   └── _Template - Employee File/        ← Copy & rename for each employee
│   │       ├── 01 - Personal Information
│   │       ├── 02 - Hire Documents/
│   │       │   ├── Offer Letter
│   │       │   ├── Signed I-9
│   │       │   ├── Signed W-4
│   │       │   ├── Direct Deposit Form
│   │       │   └── Handbook Acknowledgment
│   │       ├── 03 - Performance Reviews/
│   │       │   ├── 30-Day Review
│   │       │   ├── 60-Day Review
│   │       │   ├── 90-Day Review
│   │       │   └── Annual Reviews
│   │       ├── 04 - Training & Certifications
│   │       ├── 05 - Disciplinary Records
│   │       └── 06 - Separation & Offboarding
│   ├── 03 - Policies & Handbooks/
│   │   ├── Employee Handbook (Current)
│   │   ├── Employee Handbook (Archive)
│   │   ├── HR Policies
│   │   ├── Code of Conduct
│   │   └── Remote Work Policy
│   ├── 04 - Payroll & Benefits/
│   │   ├── Paychex Records
│   │   ├── Benefits Enrollment
│   │   ├── Compensation Structure
│   │   └── PTO & Leave Records
│   ├── 05 - Compliance & Legal/
│   │   ├── Fair Housing Training Records
│   │   ├── Anti-Harassment Training
│   │   ├── OSHA & Safety
│   │   ├── EEO Records
│   │   └── Workers Compensation
│   └── 06 - Offboarding/
│       ├── Resignation Letters
│       ├── Exit Interviews
│       ├── Equipment Return Checklists
│       └── Final Payroll Records
│
├── 04 - Training & Development/
│   ├── 01 - PropertyMAX.ai Training/
│   │   ├── Video Screen Recordings/
│   │   │   ├── Hub - Overview
│   │   │   ├── Vacancy Management
│   │   │   ├── AI Bot Features
│   │   │   ├── Leasing Workflows
│   │   │   ├── Maintenance & AppWork
│   │   │   ├── Inspections Module
│   │   │   └── Reporting & Analytics
│   │   ├── Training Guides & SOPs/
│   │   │   ├── Quick Reference Guides
│   │   │   └── Step-by-Step SOPs
│   │   └── Completion Records
│   ├── 02 - Platform Training (Other Systems)/
│   │   ├── Yardi Voyager
│   │   ├── OneSite (RealPage)
│   │   ├── AppWork
│   │   ├── Connecteam
│   │   ├── Paychex
│   │   └── Inspections Platform
│   ├── 03 - Compliance Training/
│   │   ├── Fair Housing
│   │   ├── Anti-Harassment & Discrimination
│   │   ├── OSHA & Safety
│   │   └── Data Privacy & Security
│   ├── 04 - Role-Specific Training/
│   │   ├── Leasing Agent Training
│   │   ├── Maintenance Technician Training
│   │   ├── Property Manager Training
│   │   ├── Assistant Manager Training
│   │   ├── Regional Manager Training
│   │   └── Accounting Staff Training
│   └── 05 - Leadership Development/
│       ├── COO Development
│       ├── Regional Manager Development
│       └── Succession Planning
│
├── 05 - Technology & IT/
│   ├── 01 - Platform Credentials & Access/
│   │   ├── PropertyMAX.ai
│   │   ├── Microsoft 365 & Teams
│   │   ├── Yardi Voyager
│   │   ├── OneSite (RealPage)
│   │   ├── AppWork
│   │   ├── Connecteam
│   │   ├── Paychex
│   │   ├── Phone Portal
│   │   ├── Inspections Platform
│   │   ├── Bank of America (B of A)
│   │   ├── Webster Bank
│   │   ├── Genesis
│   │   ├── Purchasing Portal
│   │   └── Sensor Platform
│   ├── 02 - Equipment Inventory/
│   │   ├── Laptops & Computers
│   │   ├── Phones & Mobile Devices
│   │   ├── Access Badges & Keys
│   │   └── Printers & Peripherals
│   ├── 03 - IT Policies & Security/
│   │   ├── Password Policies
│   │   ├── VPN & Remote Access
│   │   ├── MFA Setup Guides
│   │   ├── Acceptable Use Policy
│   │   └── Data Security & Privacy
│   └── 04 - Browser Bookmarks/
│       └── ApartmentCorp Bookmarks File (Chrome-Edge Import)
│
├── 06 - Operations & Administration/
│   ├── 01 - SOPs & Process Guides/
│   │   ├── Leasing SOPs
│   │   ├── Maintenance SOPs
│   │   ├── Move-In & Move-Out SOPs
│   │   ├── Rent Collection SOPs
│   │   ├── Eviction Process SOPs
│   │   ├── Vendor Management SOPs
│   │   └── Emergency Response SOPs
│   ├── 02 - Vendor & Contractor Management/
│   │   ├── Approved Vendor List
│   │   ├── Vendor Contracts
│   │   ├── Insurance Certificates (Vendors)
│   │   └── W-9 Forms (Vendors)
│   ├── 03 - Company Communications/
│   │   ├── Company Announcements
│   │   ├── Meeting Notes & Minutes
│   │   └── Memos
│   └── 04 - Templates & Forms Library/
│       ├── HR Templates
│       ├── Lease Templates
│       ├── Maintenance Templates
│       ├── Notice Templates
│       └── Financial Templates
│
├── 07 - Finance & Accounting/
│   ├── 01 - Monthly Financial Reports
│   ├── 02 - Annual Budgets
│   ├── 03 - Accounts Payable
│   ├── 04 - Accounts Receivable
│   ├── 05 - Banking/
│   │   ├── Bank of America
│   │   └── Webster Bank
│   ├── 06 - Tax Records
│   ├── 07 - Audit Files
│   └── 08 - Purchasing Records
│
├── 08 - Compliance & Legal/
│   ├── 01 - Fair Housing/
│   │   ├── Policies
│   │   ├── Training Completion Records
│   │   └── Incident Logs
│   ├── 02 - Corporate Documents/
│   │   ├── Entity Formation Documents
│   │   ├── Operating Agreements
│   │   └── Licenses & Permits
│   ├── 03 - Insurance/
│   │   ├── General Liability
│   │   ├── Workers Compensation
│   │   ├── Property Insurance
│   │   └── Directors & Officers
│   └── 04 - Legal Correspondence/
│       ├── Evictions
│       ├── Disputes
│       └── Contracts & Agreements
│
├── 09 - Marketing & Leasing/
│   ├── 01 - Brand Assets/
│   │   ├── Logos
│   │   ├── Brand Guidelines
│   │   ├── Photography
│   │   └── Video Assets
│   ├── 02 - Advertising/
│   │   ├── Online Listings (Apartments.com, Zillow, etc.)
│   │   ├── Social Media
│   │   └── Print & Flyers
│   └── 03 - Leasing Reports/
│       ├── Occupancy Reports
│       ├── Traffic & Conversion Reports
│       └── Renewal Reports
│
└── 10 - Archive/
    ├── Former Employees
    ├── Closed Properties
    ├── Prior Year Records
    └── Superseded Policies & Handbooks
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Employee folder | `LastName, FirstName - Job Title - YYYY-MM-DD` | `Johnson, Alex - Leasing Agent - 2026-05-18` |
| Property folder | `## - Property Name` | `01 - Boca Ciega` |
| New hire packet | `YYYY-MM-DD LastName, FirstName - New Hire Packet` | `2026-05-18 Johnson, Alex - New Hire Packet` |
| Training video | `Module - Topic - v1.0` | `Hub Overview - Dashboard Navigation - v1.0` |
| Monthly report | `YYYY-MM Property Name - Monthly Report` | `2026-05 Boca Ciega - Monthly Report` |

---

## How to Add a New Employee

1. Go to `03 - Human Resources > 02 - Employee Files`
2. Copy the `_Template - Employee File` folder
3. Rename using the naming convention above
4. Also copy the role-specific template from `01 - Company Organization` (e.g., `06 - Leasing Staff > _Template - Leasing Agent Folder`)
5. Place the completed new hire packet in `03 - Human Resources > 01 - New Hire Onboarding > Completed New Hire Packets`

## How to Add a New Property

1. Go to `02 - Properties & Buildings`
2. Copy the `_Template - Property Folder`
3. Rename using the naming convention above (e.g., `02 - Sunset Ridge`)
4. Fill in the Property Info Sheet in `01 - Property Overview`
5. Add assigned staff shortcuts in `08 - Staff Assigned to Property`
