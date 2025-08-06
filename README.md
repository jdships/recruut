# Recruut

AI-powered recruitment platform for modern teams. Streamline your hiring process with intelligent candidate assessment, automated email communication, and comprehensive applicant tracking.

## 🚀 Features

- **AI-Powered Assessment**: Automated candidate evaluation with detailed insights
- **Smart Email Communication**: Professional rejection and interview request emails
- **Applicant Tracking**: Comprehensive CRM for managing candidates
- **Bulk Operations**: Efficiently manage multiple applicants
- **Organization Management**: Multi-tenant architecture for teams
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Shadcn UI, Tailwind CSS, Radix UI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Auth.js (NextAuth)
- **Email**: Resend
- **Deployment**: Vercel-ready
- **Monorepo**: Turborepo with pnpm workspaces

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL database
- Resend API key (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jdships/recruut.git
   cd recruut
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/dashboard/.env.example apps/dashboard/.env
   cp apps/marketing/.env.example apps/marketing/.env
   cp apps/agent/.env.example apps/agent/.env
   ```

4. **Configure your environment variables**
   - Database connection string
   - Auth.js secret
   - Resend API key
   - Other required services

5. **Run database migrations**
   ```bash
   cd packages/database
   pnpm drizzle-kit push
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   - Dashboard: http://localhost:3000
   - Marketing: http://localhost:3001
   - Agent: http://localhost:3002

## 🏗️ Project Structure

```
recruut/
├── apps/
│   ├── dashboard/          # Main web application
│   ├── marketing/          # Marketing pages
│   └── agent/             # Job application agent
├── packages/
│   ├── auth/              # Authentication logic
│   ├── database/          # Database schema & client
│   ├── email/             # Email templates & sending
│   ├── ui/                # Design system
│   └── ...                # Other shared packages
└── tooling/               # Configuration packages
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm lint && pnpm typecheck`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- We use [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for code linting
- [TypeScript](https://www.typescriptlang.org/) for type safety
- Follow our [Conventional Commits](https://www.conventionalcommits.org/) specification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/jdships/recruut/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jdships/recruut/discussions)
- **Email**: hello@recruut.com

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Database powered by [Drizzle ORM](https://orm.drizzle.team/)
- Email templates with [React Email](https://react.email/)

---