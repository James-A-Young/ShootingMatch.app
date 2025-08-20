# ShootingMatch.App

ShootingMatch.App is a modern club management platform built with Next.js, designed for shooting sports organizations. It provides a robust set of features for user registration, club management, and social login, with a clean, intuitive UI and a focus on security and usability.

## Core Features

- **Landing Page:** Modern landing page with a call to action for registration.
- **User Registration:** Email/password and social SSO (Google, Microsoft).
- **Club Creation:** Users can create clubs with customizable details.
- **Role Management:** Define roles (Member, Manager) within clubs; managers can edit club details.
- **Club Join Requests:** Users can request to join clubs; managers approve requests.
- **Public Club Pages:** Clubs can share basic information publicly.

## Style Guidelines

- **Primary color:** Teal (#009688)
- **Background color:** Light grey (#F5F5F5)
- **Accent color:** Bright Orange (#FF5722)
- **Font:** 'Inter', sans-serif
- **Icons:** Simple, consistent, and related to shooting sports
- **Layout:** Clear, card-based, with intuitive navigation
- **Animations:** Subtle hover/click effects for enhanced UX

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (for local MongoDB)

### Getting Started

1. **Clone the repository**
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Start MongoDB with Docker Compose:**
	```sh
	docker-compose up -d
	```
4. **Run the development server:**
	```sh
	npm run dev
	```

The app will be available at [http://localhost:9002](http://localhost:9002) by default.

### Notes

- Make sure Docker is running before starting the dev server.
- You can stop MongoDB with `docker-compose down`.
- For SSO, configure your Google and Microsoft credentials in the environment as needed.

