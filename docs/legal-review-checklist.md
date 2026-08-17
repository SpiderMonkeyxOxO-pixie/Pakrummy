# Legal review checklist

Every page listed below is an **original drafted template**, not copied from `pakrummy.com` or any other site, and each one carries a visible "pending review by qualified Pakistani legal counsel" notice. None should be treated as final, and none constitutes legal advice. This checklist is what needs review, clause by clause, before that notice can be removed.

## `/terms/`

- [ ] Confirm eligibility/age clause (Section 1) matches the actual minimum age requirement under applicable law, not just our assumed 18+.
- [ ] Confirm the "scope of this site" clause (Section 2) accurately and defensibly describes an information-only, non-operator relationship — this is the load-bearing distinction the whole legal framing depends on.
- [ ] Confirm the limitation-of-liability clause (Section 6) is enforceable in the relevant jurisdiction and not overreaching or underreaching.
- [ ] Confirm intellectual-property clause (Section 5) correctly handles descriptive/nominative use of the "Pak Rummy" trademark.
- [ ] Confirm the operator has no objection to being referenced descriptively under trademark law in the relevant jurisdiction.

## `/privacy-policy/`

- [ ] Confirm which data-protection framework (if any) actually applies to Pakistani visitors and to `pakrummyofficial.com` as operated (Section 4, "legal basis").
- [ ] Confirm retention periods (Section 7) once real logging/hosting infrastructure is chosen — current language is intentionally generic ("as long as needed") pending that decision.
- [ ] Confirm international-processing disclosure (Section 12) once a hosting provider and its data-residency location are chosen.
- [ ] Confirm the user-rights section (Section 9) matches whatever legal framework actually applies — currently framed generically without naming a specific statute.

## `/cookie-policy/`

- [ ] Re-verify this page still accurately says "no analytics active" at time of legal review — if `PUBLIC_GA4_ID`/`PUBLIC_GTM_ID` have been set by then (see `docs/analytics-events.md`), this page needs a rewrite before it can be considered accurate, not just legally reviewed.
- [ ] Confirm whether a cookie consent banner is legally required for the intended audience before analytics is switched on.

## `/disclaimer/`

- [ ] Confirm the "not the game operator" framing throughout is legally sufficient to avoid being construed as an agent, affiliate, or representative of the operator.

## `/dmca/`

- [ ] Confirm whether DMCA (a US statute) is the right framework to reference at all for a Pakistan-focused site, or whether a locally-applicable copyright notice process should be used instead or in addition.

## `/legal-status/`

- [ ] This page deliberately makes **no claim** that real-money gaming is legal throughout Pakistan and explicitly avoids copying India-specific state restriction lists (see `docs/pre-build-audit.md` for why that was a problem in the reference material). Counsel should confirm this careful non-claim is itself accurate and doesn't inadvertently imply something false by omission.
- [ ] Confirm whether Pakistani law requires any additional disclosure we haven't included.

## `/responsible-gaming/` and `/age-restrictions/`

- [ ] Confirm the 18+ framing is the correct minimum age threshold (not just an assumption carried from `SITE.minimumAge`).
- [ ] Confirm whether local law requires a specific self-exclusion mechanism or helpline reference we should add once available (`SITE.responsibleGamingContact` is currently unverified/empty — see `docs/required-verification.md`).

## Cross-cutting

- [ ] Confirm `SITE.editorialContactEmail` (`contact@pakrummyofficial.com`) is a real, monitored inbox before legal pages that reference it go live — currently a placeholder address scaffolded for this build, not yet confirmed as provisioned.
- [ ] Confirm none of the six legal pages' "Effective date"/"Last revised" values (currently all 2026-08-17, the build date) need to be back-dated or handled differently for compliance purposes.
- [ ] Re-run this checklist any time SITE.md`positioning`, `operatorLegalName`, or any other `Verified<T>` field in `src/config/site.ts` flips from unverified to verified — a newly confirmed operator fact can change what a legal page needs to say.
