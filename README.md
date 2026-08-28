# Cecilia Digital Readiness Gateway

> **Maturity: development-branch prototype — not production-ready and not deployed from the default branch**

Cecilia Digital Readiness Gateway is a multilingual assessment and lead-workflow concept for helping Sarawak small and medium enterprises reflect on their digital presence and identify practical next steps. It is a demonstration product, not an official eligibility, funding or government-approval service.

The current application source is preserved on the public [development branch](https://github.com/zaiwin-lab/KDP-Cecilia/tree/claude/dazzling-maxwell-x31ac2). The default branch contains this portfolio documentation only. No verified public live demonstration is currently evidenced.

## Business problem

Small-business owners often receive broad digitalisation advice without a quick way to connect their current practices to an actionable improvement path. Programme teams also need a consistent intake experience before conducting human review and follow-up.

## Intended users

- Sarawak SME owners exploring improvements to their digital presence
- Programme or advisory teams reviewing self-reported readiness
- Internal administrators following up with interested businesses
- Product stakeholders evaluating a multilingual assessment workflow

These are intended user groups, not evidence of adoption or active programme participation.

## What the prototype demonstrates

The development branch contains:

- a seven-question digital-presence assessment
- deterministic, explainable scoring rather than a machine-learning model
- Bahasa Malaysia, English, Mandarin and Iban interface content
- a demonstration mode and a results/certificate experience
- contact and business-detail capture
- browser-local records plus optional Netlify Blobs persistence
- an administrative list with search, status handling, deletion and WhatsApp follow-up
- optional WATI notification integration
- a ToyyibPay bill-creation and callback workflow

The repository therefore demonstrates a connected assessment-to-follow-up journey. It does **not** establish that the workflow is secure enough for real applicants or that any payment, voucher or programme claim is authorised.

## Strategic value

The concept shows how a lightweight assessment can turn general digitalisation interest into structured, reviewable next steps. With proper governance, it could support triage, human advisory conversations and programme learning while keeping the score transparent.

## Technology

- HTML, CSS and browser JavaScript
- Netlify Functions and Netlify Blobs
- WATI integration hooks
- ToyyibPay integration hooks
- localStorage-based demonstration state

There is no model-based AI in the inspected implementation. The “intelligence” is deterministic assessment logic and workflow automation.

## Delivery role

Product direction, workflow design and prototype delivery were led by **Ts. Zaiwin Kassim** with the **KOBIS AI Prodigy Team**. This statement describes the repository’s delivery role; it does not imply endorsement by any government body, funder, platform provider or other named organisation.

## Responsible use and critical limitations

Do not use the current branch to collect real applicant or payment data.

- **Programme claims are unverified.** References in the application to KDP Sarawak, government support, voucher values, eligibility or approval must be treated as demonstration copy until an authorised programme owner confirms them.
- **Administrative access is not secure.** The inspected dashboard relies on a hard-coded client-side password and browser storage.
- **Personal data endpoints need protection.** The current serverless submission workflow permits broad record operations without demonstrated server-side authentication or role-based authorisation.
- **Payment handling is not production-grade.** Bill amount and metadata originate from the client, and the callback implementation does not evidence signed-callback verification or independent settlement reconciliation.
- **Scoring is advisory only.** Self-reported answers and deterministic rules are not a business certification, funding decision or professional digital audit.
- **Language and accessibility need review.** All translations and user journeys require review by fluent speakers and representative users.
- **Retention and consent are incomplete.** A production version needs clear consent, purpose limitation, retention periods, deletion procedures, audit logging and breach response.

## Evidence boundary

This README describes only what was inspected in the repository and its named development branch. It makes no claim about user numbers, programme approval, funding availability, revenue, conversion, partnerships or production readiness.
