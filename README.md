# EriEthio Research Website

## Overview

EriEthio Research Website is a modern, full-stack web application built with Next.js 14, featuring a dynamic content management system, e-commerce capabilities, and comprehensive research content management. The platform serves as a hub for research publications, case studies, and product showcases.

## Features

- 🛍️ E-commerce Platform
- 📚 Research Publication Management
- 📊 Case Studies Showcase
- 📝 Blog Management
- 👥 User Authentication & Authorization
- 🎨 Modern, Responsive Design
- 🔍 Advanced Search Capabilities
- 📱 Mobile-First Approach

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **Media Management**: Cloudinary
- **Deployment**: Vercel

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions
- [Database Management](docs/DATABASE_GUIDE.md) - Database setup and maintenance
- [Content Management](docs/CONTENT_MANAGEMENT_GUIDE.md) - Guide for managing website content

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd eri-ethio-research-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with necessary environment variables (see `.env.example`).

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eri-ethio-research-website/
├── src/
│   ├── app/              # Next.js 14 app directory
│   ├── components/       # Reusable React components
│   ├── lib/             # Utility functions and configurations
│   └── styles/          # Global styles and Tailwind config
├── public/              # Static assets
├── prisma/             # Database schema and migrations
├── docs/              # Documentation
└── tests/             # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@eriethio.com or join our Slack channel.
