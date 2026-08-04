# Financial Projections Evaluation: Bridge vs. Scale Financing Model

**Prepared by:** Manus AI
**Date:** April 5, 2026

## Executive Summary

I have conducted a comprehensive review of the "Bridge vs Scale Financing Model" workbook. The model is well-structured in its intent to separate a near-term $250K bridge financing ask from a longer-term $1.5M scale operating plan while maintaining a consistent revenue forecast. This is a sophisticated approach that allows founders to demonstrate capital efficiency while preserving the upside of their three-year vision.

However, the workbook contains several critical mechanical errors in the cash flow and balance sheet statements, as well as significant discrepancies between the headcount build and the income statement assumptions. These issues must be corrected before presenting the model to investors, as they undermine the mechanical integrity of the financial projections.

## Structural Analysis and Financial Logic

The model effectively presents two distinct operating scenarios that achieve the exact same revenue targets ($250K in Year 1, $850K in Year 2, and $1.9M in Year 3). 

### The Bridge Case (Current Ask)
The Bridge scenario models a highly capital-efficient path. It assumes a $250K initial raise, followed by a $1.25M seed round in Year 2, contingent upon hitting specific milestones. 

This scenario demonstrates impressive operating leverage. By Year 2, the company reaches near-breakeven with an EBITDA of -$3,000, and by Year 3, it generates $500,167 in net income. The Year 1 burn is contained at a net loss of $135,833. This narrative is compelling for investors in a constrained capital environment, as it shows the team can achieve significant commercial traction with minimal initial funding.

### The Scale Case (Full Upfront Funding)
The Scale scenario models a more aggressive operating plan funded by a $1.5M upfront raise. This case assumes significantly higher operating expenses across all categories, particularly in payroll, sales, and marketing.

Consequently, the financial profile is much more cash-intensive. Year 1 net losses expand to $552,500, and Year 2 losses remain high at $447,933. The company barely reaches profitability in Year 3, generating only $73,333 in net income. While this scenario reduces financing risk by securing all capital upfront, it significantly dilutes early investors and requires a much higher burden of proof for the expanded expense base, given that it yields the exact same revenue as the Bridge case.

## Critical Errors and Discrepancies

During the evaluation, I identified several mechanical errors and logical disconnects that require immediate remediation.

### 1. Broken Financial Statements
Both the `Bridge_CF` (Cash Flow) and `Scale_CF` sheets contain cascading `#VALUE!` errors originating from the "Increase / (decrease) in accounts payable" line item. This error flows through to Net Cash from Operations, Beginning Cash, Net Change in Cash, and Ending Cash. 

Because the cash flow statements are broken, the `Bridge_BS` (Balance Sheet) and `Scale_BS` sheets also fail to balance. The `#VALUE!` errors propagate to the Cash and Accounts Payable lines, resulting in errors across Total Assets, Total Liabilities, Total Equity, and the final Balance Check.

### 2. Headcount vs. Payroll Disconnect
There is a material discrepancy between the detailed `Headcount` build and the payroll assumptions used in the Income Statements. 

In the Bridge scenario, the `Headcount` sheet calculates Year 1 payroll and benefits at $235,750, but the `Bridge_IS` only reflects $210,000. This gap widens significantly in the Scale scenario, where the `Headcount` sheet calculates Year 1 payroll at $514,625, but the `Scale_IS` assumes $420,000. The model must reconcile the bottom-up headcount build with the top-down P&L assumptions to ensure the burn rate is accurately projected.

### 3. Summary Sheet Hardcoding
The `Summary` sheet, which is designed to provide a side-by-side comparison of the two cases, contains hardcoded placeholder values for EBITDA that do not match the actual calculations in the respective Income Statements. For example, the Summary shows Bridge Year 1 EBITDA as $20,000, whereas the actual `Bridge_IS` calculates it as -$135,000. This creates a misleading presentation of the company's profitability.

### 4. Use of Funds Errors
The `Use_of_Funds` sheet contains `#DIV/0!` and `#REF!` errors in the Scale Case section, specifically in the percentage calculations and the total sum row. This prevents a clear understanding of how the $1.5M would be allocated.

## Strategic Suggestions for Improvement

To strengthen the model and prepare it for investor diligence, I recommend the following actions:

### Mechanical Fixes
1. **Repair the Accounts Payable Formula:** Investigate the AP calculation in the Cash Flow statements. It is likely referencing a text string or an invalid range. Fixing this single line item should resolve the cascading errors across the Cash Flow and Balance Sheet tabs.
2. **Link the Summary Sheet:** Replace the hardcoded EBITDA values in the `Summary` sheet with direct cell references to the `Bridge_IS` and `Scale_IS` tabs to ensure data consistency.
3. **Correct the Use of Funds:** Fix the sum formula and percentage calculations in the Scale Case section of the `Use_of_Funds` sheet.

### Logical Refinements
1. **Reconcile Headcount and Payroll:** Decide whether the P&L should be driven by the bottom-up `Headcount` tab or the top-down assumptions. Currently, they are disconnected. I recommend linking the P&L payroll lines directly to the `Headcount` tab outputs to ensure that any changes to hiring plans automatically update the financial statements.
2. **Justify the Scale Case:** The current model shows that the company can achieve $1.9M in Year 3 revenue with either $1.5M in total funding (Bridge) or $1.5M upfront (Scale), but the Scale case results in vastly lower profitability. Investors will question why they should fund the Scale case if the Bridge case yields the same top-line results with better margins. You should either increase the revenue targets in the Scale case to justify the higher expense base or clearly articulate that the Scale case represents a lower-risk execution path (e.g., hiring more experienced, expensive talent to ensure the revenue targets are met).
3. **Review Revenue Concentration:** In Year 1, 72% of revenue comes from core subscriptions. Ensure you have a strong pipeline or signed contracts to support this concentration, as missing this single target will significantly impact the entire forecast.

By addressing these mechanical errors and refining the strategic narrative, this workbook will serve as a robust and compelling tool for your fundraising efforts.
