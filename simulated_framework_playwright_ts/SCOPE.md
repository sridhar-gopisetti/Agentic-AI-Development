# simulated_framework*/ — Workflow Scope

<!-- workflow_scope: acg,tew | extraction: include in ACG and TEW bundles — DIW does not execute tests -->

## Purpose
These four directories are the **framework sandboxes** for the supported test automation stacks.
ACG generates code into them; TEW executes that code from them.

| Directory | Stack |
|-----------|-------|
| `simulated_framework/` | Selenium Java (legacy default) |
| `simulated_framework_selenium_java/` | Selenium Java (current) |
| `simulated_framework_playwright_java/` | Playwright Java |
| `simulated_framework_playwright_ts/` | Playwright TypeScript |

## Used by
| Workflow | Role | Detail |
|----------|------|--------|
| **ACG** | ✅ Write target | Stage 4 (Automation_Code_Generator) writes generated `.java`/`.ts` test files here. The path is recorded in `WORKFLOW_CONTEXT.json → generated_file_path`. |
| **TEW** | ✅ Execution target | TEEA invokes the test runner (Maven/npm) from inside the appropriate directory. The generated file at `generated_file_path` must exist here before TEW starts. |
| **DIW** | ❌ Not used | DIW works only with TEW's execution report and evidence — it does not re-execute tests. |

## ACG → TEW handoff
After ACG completes with `audit_report.md STATUS: PASS`, the generated test file
at `WORKFLOW_CONTEXT.json → generated_file_path` inside one of these directories is
the primary TEW entry-point artefact. TEW bootstrap validates that this file exists
before allowing any stage to run.
