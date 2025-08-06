# Demo Data Population Script

This directory contains a script to populate the demo account with realistic data for showcasing the Recruut platform.

## Script: `populate-demo-data.ts`

Populates the `hello@recruut.io` account (organization: `recruut-demo`) with:

- ✅ **5 Job Opportunities** - Different roles (Frontend Engineer, Full Stack Developer, Product Designer, DevOps Engineer, Data Scientist)
- ✅ **8 Realistic Applications** - Complete with AI assessments, scores, and detailed submission data  
- ✅ **Contact Records** - For all applicants with proper contact information
- ✅ **AI Evaluations** - Realistic AI scores (6.8-9.3) and assessments for each candidate
- ✅ **Application Status** - Mix of submitted, reviewed, and shortlisted applications
- ✅ **Submission Dates** - Realistic clustering (some busy days, some quiet days)
- ✅ **All Jobs Covered** - Every opportunity gets at least one applicant

### Demo Account Details
- **Email**: `hello@recruut.io`
- **Organization**: `recruut-demo` 
- **Plan**: Pro (for demo purposes)
- **Admin Access**: Full admin rights for demo user

### Sample Applications Include:

1. **Sofia Muller** - Senior Frontend Engineer (Score: 8.7/10, Status: Shortlisted)
2. **Thomas Clark** - Full Stack Developer (Score: 9.1/10, Status: Reviewed)  
3. **Mei Ling Chen** - Product Designer (Score: 8.4/10, Status: Shortlisted)
4. **Gabriel Fischer** - DevOps Engineer (Score: 8.9/10, Status: Reviewed)
5. **Olivia Weber** - Data Scientist (Score: 9.3/10, Status: Shortlisted)
6. **Lucia Bianchi** - Frontend Developer (Score: 7.2/10, Status: Submitted)
7. **Hugo Schmidt** - Junior Developer (Score: 6.8/10, Status: Submitted)
8. **Victoria Ballard** - Data Analyst (Score: 7.9/10, Status: Reviewed)

Each application includes:
- Complete candidate information (education, experience, portfolio)
- Realistic AI assessments explaining strengths and fit
- Detailed submission data with motivation and achievements
- Proper application status and timeline

### Application Distribution & Timeline

**Job Coverage**: All 5 opportunities receive applications:
- **Frontend Engineer**: 3 applications (most popular role)
- **Full Stack Developer**: 2 applications  
- **Product Designer**: 2 applications
- **DevOps Engineer**: 1 application
- **Data Scientist**: 1 application

**Realistic Timeline**: Applications are clustered on specific days:
- **2 days ago**: 2 applications (busy day)
- **5 days ago**: 1 application
- **8 days ago**: 2 applications (busy day)  
- **12 days ago**: 1 application
- **15 days ago**: 1 application
- **18 days ago**: 1 application

This creates a realistic chart with peaks and valleys instead of uniform daily submissions.

## Usage

### Option 1: Using the API route (Recommended - works around ESM issues)
1. Start the development server:
```bash
cd apps/dashboard
pnpm dev
```

2. In another terminal, call the API:
```bash
pnpm populate-demo
# OR manually:
curl -X POST http://localhost:3000/api/populate-demo
```

### Option 2: Direct TypeScript execution (if you fix the ESM issues)
```bash
cd apps/dashboard
npx tsx scripts/populate-demo-data.ts
```

### Option 3: Browser/Postman
1. Start `pnpm dev`
2. Make a POST request to: `http://localhost:3000/api/populate-demo`
3. Check the response for success/error details

## Troubleshooting

### Common Issues:

1. **"Cannot find module 'pg'"** - This is an ESM/Node.js compatibility issue
   - Try running from the project root: `npx tsx apps/dashboard/scripts/populate-demo-data.ts`
   - Ensure your Node.js version is compatible (20+)

2. **Database Connection Issues** - Ensure your `.env` file is properly configured
   - Check `DATABASE_URL` is set correctly
   - Ensure database is running and accessible

3. **Permission Issues** - Make sure the database user has proper permissions
   - Needs CREATE, INSERT permissions on all tables
   - Needs access to the schema

### Environment Requirements:
- Node.js 20+
- Properly configured `.env` file with database credentials
- Database connection working (test with `pnpm dev` first)

## Note

If you encounter persistent module resolution issues, the demo data can be created manually through the UI, or the script logic can be adapted to run as a Next.js API route for easier execution within the application context.

The script is designed to be safe to run multiple times - it checks for existing organizations and users before creating them.