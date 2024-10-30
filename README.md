<p align=”center”>
<img width=”200" height=”200" src="https://github.com/user-attachments/assets/a084b748-ae0b-49a7-8faf-d4c9b2808f68" alt="my banner">
</p>


# Ritchie's Bus Schedule

Welcome to the source code for Ritchie's Bus Schedule. This is a web application intended to help users find bus routes quickly and easily without the hassle of searching through multiple tables and scrolling through long lists of time schedules.

## Features
- Status of the current bus route
- See bus route lists
- See stop lists
- See bus routes by stop and vice versa
- Favorite bus routes for more relavant information on the top of the home page
- Login and rate bus routes
- Responsive design for desktop, mobile, and very small screens

## Deployed Application
- Deployed version: [rit-bus.app](https://rit-bus.app/)
- About this project: [About Page](https://www.rit-bus.app/about)

## Tech Stack
Language
- TypeScript  
Everything is written in TypeScript for type safety, rapid development, and better developer experience. This project was build from scratch from the front-end to the back-end with 100% TypeScript.

Frameworks
- Next.js
This is a React framework that allows for server-side rendering and static site generation, making it a great choice for building fast and scalable web applications. It also enables us to create API routes easily and manage routing as well as utilize new React features like React Server components which improves performance on load times.
- Prisma
This is an ORM (Object Relational Mapping) tool that allows us to interact with the database in a type-safe manner. It simplifies database queries and migrations, making it easier to manage the database schema. Initially, this project utilized a different database but was migrated to Supabase due to pricing. Prisma enabled us to migrate the database with ease.
- Tailwind CSS
This is a utility-first CSS framework that allows for rapid UI development. It provides a set of pre-defined classes that can be composed to create custom designs without writing custom CSS. This project utilizes Tailwind CSS for styling and responsive design. It also allows for easy customization and theming which is a difficult task with traditional UI libraries like Bootstrap and Material UI.
- tRPC
This is a remote procedure call framework that allows for type-safe API calls between the client and server. It simplifies the process of creating and consuming APIs, making it easier to build full-stack applications with TypeScript. It also eliminates the need for REST or GraphQL, allowing for a more streamlined development process. Utilizing tTPC ensures that the client and server are always in sync with the types, reducing the chances of runtime errors and improving developer experience and development speed.

Database
- SupaBase
This is an open-source Firebase alternative that provides a real-time database, authentication, and storage. It is built on top of PostgreSQL and provides a simple API for interacting with the database. Supabase is used for storing user data, bus routes, and stop information. While this application does not utilize the real-time features of Supabase, it provides a solid foundation for future enhancements. It also allows for easy integration with Prisma for type-safe database queries. It also provides a free tier for small projects like this one which is a great advantage for developers on a budget and quick prototyping.

Authentication
- Clerk.js
This is an authentication service that provides a simple way to add user authentication to web applications. It supports various authentication methods, including email/password, social logins, and magic links. Clerk.js is used for user authentication in this application, allowing users to sign up, log in, and manage their accounts easily. It also allows us to focus on building features rather than worrying about authentication implementation. While the t3 stack that this project utilizes uses NextAuth, I opted for Clerk.js due to its ease of use and better developer experience. It also reduced the amount of deployed instances to just 1.

Host
- Vercel
This is a cloud platform for static sites and serverless functions that is built on top of Next.js. It provides a simple way to deploy and host web applications with automatic scaling and global CDN. Vercel is used to host this application, providing fast load times and easy deployment. Vercel also uses 1-click deployments which makes it easy to push changes to production and is also a wrapper around AWS which provides a solid foundation for hosting applications and can be forked for more scalling options.

More information on the technology used: [ct3-app](https://create.t3.gg/)
