🏢 Multi-Tenant SaaS Backend

Node.js · PostgreSQL

A production-grade, multi-tenant SaaS backend foundation where a single backend securely serves multiple organizations with strict tenant isolation, RBAC, and invitation-based onboarding.

Architecture-first. Security-first. Feature-complete by design, not by accident.

🔍 What This Demonstrates (Quick Scan)

✅ Correct multi-tenant modeling

✅ Permission-based RBAC (DB-driven)

✅ Invitation-based org membership

✅ Tenant-scoped queries everywhere

✅ Stateless authentication

❌ CRUD completeness (intentionally deferred)

🧠 Core Rule

Authentication → who you are
Authorization → what you can do
Tenant ID → where you can do it

🧱 Architecture Overview
Auth (identity only)
        ↓
Tenants (organizations)
        ↓
Memberships (user_tenants)
        ↓
Roles → Permissions (RBAC)
        ↓
Business Services (Tasks)

🔐 Authentication
<details> <summary><strong>Details</strong></summary>

JWT-based authentication

Short-lived access tokens + refresh tokens

Secure password hashing

Token payload

{ "userId": "<uuid>" }


🚫 No tenant, role, or permission data in tokens
✔ All authorization decisions are database-driven

</details>
🏢 Tenants & Memberships
<details> <summary><strong>Details</strong></summary>

Users can belong to multiple organizations

Invitation-based onboarding

Membership lifecycle

invited → active → rejected


Core tables

tenants

user_tenants

roles

</details>
🛂 RBAC (Role-Based Access Control)
<details> <summary><strong>Details</strong></summary>

Permissions are global

Roles are tenant-scoped

Code checks permissions, never roles

Example permissions

tenant.invite

task.create

task.view

task.delete

Middleware

can("task.create")


✔ Immediate permission revocation
✔ No hard-coded authorization logic

</details>
📦 Business Service: Tasks
<details> <summary><strong>Details</strong></summary>

APIs

POST   /tenants/:id/tasks
GET    /tenants/:id/tasks
DELETE /tenants/:id/tasks/:taskId


Guarantees

Tenant isolation enforced at query level

RBAC enforced on every request

Soft deletes

UUID primary keys

⚠ Task update is intentionally deferred (see Scope).

</details>
🗂 Project Structure
<details> <summary><strong>Details</strong></summary>
src/
 ├─ modules/
 │   ├─ auth/
 │   ├─ tenant/
 │   ├─ business/
 ├─ middlewares/
 ├─ utils/
 └─ routers/


Each module follows:

routes → controllers → services → repositories → queries


Designed for testability and extension.

</details>
🧪 Testing Strategy
<details> <summary><strong>Details</strong></summary>

Integration tests: Supertest + real DB

Unit tests: service layer (repositories mocked)

RBAC validated via real HTTP flows

Scope decision

Tenant & Membership flows are integration-tested

Business (Tasks) integration tests are not duplicated, as they reuse the same authorization and tenant-scoping logic already validated elsewhere

This is an intentional engineering tradeoff.

</details>
📌 Scope & Non-Goals (Current Phase)
<details> <summary><strong>Why some things are missing</strong></summary>

Task update API

Duplicate integration tests for structurally identical services

The focus is on multi-tenant safety, RBAC correctness, and authorization guarantees, not CRUD completeness.

These features can be added without architectural changes.

</details>
🛡 Security Guarantees

Tenant-scoped queries everywhere

No hard-coded roles

Immediate permission revocation

Multi-organization users supported

Stateless backend (no server-side active tenant)

🚀 Status

✅ Core architecture complete

✅ Multi-tenant isolation enforced

✅ RBAC implemented and verified

✅ Ready for production-level extension

🧠 Final Note

This repository represents a production-grade SaaS backend foundation, intentionally scoped to validate architectural correctness before feature expansion.