# MyMemori

**Every moment of the event, in one place.**

MyMemori is a live event photo-sharing platform built to preserve the memories of an event. Guests upload photos to a shared live gallery during the event, and the host gets a complete album afterward, with no app download needed.

🌐 **Live:** [mymemori.site](https://mymemori.site)

---

## Why MyMemori

Most events already have a professional photographer, and MyMemori is not here to replace them. A photographer can only capture a fraction of an event, while the rest of the moments stay scattered across guests' phones. MyMemori brings those moments into a single shared space, so more of the event is saved. It works alongside professional photography and adds the candid moments one photographer can't reach.

## Features

- **Live shared gallery:** guests upload photos during the event and everyone sees them in one place.
- **Complete album for the host:** all photos collected in one album after the event.
- **No app download:** guests join and upload from the browser.
- **Payments:** dual gateway support (Paystack and Flutterwave) with secure webhook handling.
- **Server-side image processing:** uploaded photos are processed on the backend.
- **Account security:** JWT-based authentication and email-based password reset.
- **Gifting (rolling out):** guests can send gifts and contributions to the host through the same experience.

## Tech Stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | React, Vite (pnpm)    |
| Backend          | Java, Spring Boot     |
| Database         | PostgreSQL (Neon)     |
| Auth             | JWT                   |
| Payments         | Paystack, Flutterwave |
| Image processing | Scrimage              |
| Email templates  | Thymeleaf             |
| Hosting          | Render                |

## Getting Started

> Fill in the exact commands and variable names to match your repository.

### Prerequisites

- Java (version used by the project)
- Node.js and pnpm
- PostgreSQL database

### Backend

```bash
git clone <repo-url>
cd <backend-folder>
# configure environment variables (see below)
./mvnw spring-boot:run
```

### Frontend

```bash
cd <frontend-folder>
pnpm install
pnpm dev
```

## Contributing

Contributions are welcome. To get started:

1. Fork the repository and create a branch for your change.
2. Make your changes and add tests where relevant.
3. Open a pull request describing what you changed and why.

Look for issues labeled `good first issue` if you're new.
