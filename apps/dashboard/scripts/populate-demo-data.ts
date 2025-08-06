#!/usr/bin/env tsx

/**
 * Demo Data Population Script
 *
 * Populates the recruut-demo organization with realistic:
 * - Job opportunities
 * - Applications with AI assessments
 * - Contact data
 *
 * Usage: pnpm populate-demo (from apps/dashboard directory)
 */

import { db, eq } from "@workspace/database/client";
import {
	ActionType,
	ActorType,
	ApplicationFlag,
	ApplicationStatus,
	applicationTable,
	ContactRecord,
	ContactStage,
	contactActivityTable,
	contactTable,
	membershipTable,
	opportunityTable,
	organizationTable,
	Role,
	userTable,
} from "@workspace/database/schema";
import { addHours, subDays } from "date-fns";
import { v4 } from "uuid";

// Demo organization and user details
const DEMO_ORG = {
	email: "hello@recruut.io",
	orgSlug: "recruut-demo",
	orgName: "Recruut Demo",
	userName: "Demo User",
};

// --- Helper Functions ---

// Helper functions for future image handling removed for now

async function createDemoOrganizationAndUser(): Promise<{
	organizationId: string;
	userId: string;
}> {
	console.log("🏢 Creating demo organization and user...");

	return await db.transaction(async (tx) => {
		// Check if organization already exists
		const existingOrg = await tx
			.select({ id: organizationTable.id })
			.from(organizationTable)
			.where(eq(organizationTable.slug, DEMO_ORG.orgSlug))
			.limit(1);

		let organizationId: string;

		if (existingOrg.length > 0) {
			organizationId = existingOrg[0].id;
			console.log(`✅ Organization "${DEMO_ORG.orgName}" already exists`);
		} else {
			const [org] = await tx
				.insert(organizationTable)
				.values({
					name: DEMO_ORG.orgName,
					slug: DEMO_ORG.orgSlug,
					email: DEMO_ORG.email,
					plan: "pro", // Give demo account pro features
					website: "https://recruut.io",
					address: "123 Demo Street, San Francisco, CA 94105, USA",
				})
				.returning({ id: organizationTable.id });

			organizationId = org.id;
			console.log(`✅ Created organization "${DEMO_ORG.orgName}"`);
		}

		// Check if user already exists
		const existingUser = await tx
			.select({ id: userTable.id })
			.from(userTable)
			.where(eq(userTable.email, DEMO_ORG.email))
			.limit(1);

		let userId: string;

		if (existingUser.length > 0) {
			userId = existingUser[0].id;
			console.log(`✅ User "${DEMO_ORG.email}" already exists`);
		} else {
			const [user] = await tx
				.insert(userTable)
				.values({
					email: DEMO_ORG.email,
					name: DEMO_ORG.userName,
					emailVerified: new Date(),
					completedOnboarding: true,
				})
				.returning({ id: userTable.id });

			userId = user.id;
			console.log(`✅ Created user "${DEMO_ORG.email}"`);

			// Create membership
			await tx.insert(membershipTable).values({
				organizationId,
				userId,
				role: Role.ADMIN,
				isOwner: true,
			});
			console.log(`✅ Created admin membership`);
		}

		return { organizationId, userId };
	});
}

async function createDemoOpportunities(
	organizationId: string,
	userId: string,
): Promise<string[]> {
	console.log("💼 Creating demo opportunities...");

	const opportunityIds: string[] = [];

	for (const opportunity of demoOpportunities) {
		const opportunityId = v4();

		await db.insert(opportunityTable).values({
			id: opportunityId,
			organizationId,
			createdBy: userId,
			title: opportunity.title,
			description: opportunity.description,
			moreContext: opportunity.moreContext,
			hiringManagerEmail: DEMO_ORG.email,
			status: "active",
			documents: opportunity.documents || null,
		});

		opportunityIds.push(opportunityId);
		console.log(`✅ Created opportunity: ${opportunity.title}`);
	}

	return opportunityIds;
}

async function createDemoApplications(
	organizationId: string,
	userId: string,
	opportunityIds: string[],
): Promise<void> {
	console.log("📝 Creating demo applications...");

	const now = new Date();

	// Distribute applications across opportunities
	const applicationsPerOpportunity = Math.ceil(
		demoApplicants.length / opportunityIds.length,
	);

	for (let i = 0; i < demoApplicants.length; i++) {
		const applicant = demoApplicants[i];
		const opportunityIndex = Math.floor(i / applicationsPerOpportunity);
		const opportunityId = opportunityIds[opportunityIndex] ?? opportunityIds[0];

		// Create application submission date (within last 30 days)
		const daysAgo = Math.floor(Math.random() * 30);
		const hoursAgo = Math.floor(Math.random() * 24);
		const submissionDate = addHours(subDays(now, daysAgo), hoursAgo);

		// Create contact record for the applicant
		const contactId = v4();

		// Use image path directly for now (images will be served from public folder)
		const imageUrl = applicant.image;

		await db.transaction(async (tx) => {
			// Create contact
			await tx.insert(contactTable).values({
				id: contactId,
				organizationId,
				name: applicant.name,
				email: applicant.email,
				phone: applicant.phone,
				address: applicant.address,
				image: imageUrl,
				record: ContactRecord.PERSON,
				stage: ContactStage.OPPORTUNITY,
				createdAt: submissionDate,
				updatedAt: submissionDate,
			});

			// Skip contact image creation for now - we'll just reference the public images

			// Create application
			await tx.insert(applicationTable).values({
				organizationId,
				opportunityId,
				name: applicant.name,
				email: applicant.email,
				phone: applicant.phone,
				education: applicant.education,
				experience: applicant.experience,
				portfolioUrl: applicant.portfolioUrl,
				travelWillingness: applicant.travelWillingness,
				resumeUrl: applicant.resumeUrl,
				image: imageUrl,
				aiScore: applicant.aiScore,
				aiFlag: applicant.aiFlag,
				aiAssessment: applicant.aiAssessment,
				status: applicant.status,
				submissionData: {
					rawAnswers: applicant.submissionData,
					submittedAt: submissionDate.toISOString(),
				},
				createdAt: submissionDate,
				updatedAt: submissionDate,
			});

			// Create contact activity
			await tx.insert(contactActivityTable).values({
				contactId,
				actionType: ActionType.CREATE,
				actorId: userId,
				actorType: ActorType.MEMBER,
				metadata: {
					type: "application_submitted",
					opportunityId,
					applicationData: {
						name: applicant.name,
						email: applicant.email,
						aiScore: applicant.aiScore,
						aiFlag: applicant.aiFlag,
					},
				},
				occurredAt: submissionDate,
			});
		});

		console.log(
			`✅ Created application: ${applicant.name} for ${demoOpportunities[opportunityIndex]?.title ?? "Unknown"}`,
		);
	}
}

// --- Main Function ---

export async function populateDemoData(): Promise<void> {
	console.log("🚀 Starting demo data population...\n");

	try {
		// 1. Create organization and user
		const { organizationId, userId } = await createDemoOrganizationAndUser();

		// 2. Create opportunities
		const opportunityIds = await createDemoOpportunities(
			organizationId,
			userId,
		);

		// 3. Create applications
		await createDemoApplications(organizationId, userId, opportunityIds);

		console.log("\n🎉 Demo data population completed successfully!");
		console.log(`📊 Created:`);
		console.log(`   • 1 organization (${DEMO_ORG.orgName})`);
		console.log(`   • 1 user (${DEMO_ORG.email})`);
		console.log(`   • ${demoOpportunities.length} opportunities`);
		console.log(`   • ${demoApplicants.length} applications`);
		console.log(`   • ${demoApplicants.length} contacts`);
	} catch (error) {
		console.error("❌ Error during demo data population:", error);
		throw error;
	}
}

// --- Demo Data Definitions ---

const demoOpportunities = [
	{
		title: "Senior Frontend Engineer",
		description:
			"We're looking for an experienced frontend engineer to join our team and help build the next generation of recruiting tools. You'll work with React, TypeScript, and modern web technologies.",
		moreContext:
			"This role involves working closely with our design team to create beautiful, accessible user interfaces. Experience with Next.js, Tailwind CSS, and design systems is a plus.",
		documents: ["https://example.com/job-description-frontend.pdf"],
	},
	{
		title: "Full Stack Developer",
		description:
			"Join our engineering team as a full stack developer. Work on both frontend and backend systems, including our API, database design, and user interfaces.",
		moreContext:
			"You'll be working with our modern tech stack including Next.js, Node.js, PostgreSQL, and cloud infrastructure. Experience with DevOps and CI/CD is valued.",
		documents: ["https://example.com/job-description-fullstack.pdf"],
	},
	{
		title: "Product Designer",
		description:
			"Help shape the future of recruiting software as our product designer. You'll work on user research, wireframing, prototyping, and creating beautiful user experiences.",
		moreContext:
			"We're looking for someone with experience in B2B SaaS design, user research methodologies, and modern design tools like Figma. Understanding of accessibility standards is important.",
		documents: null,
	},
	{
		title: "DevOps Engineer",
		description:
			"Build and maintain our cloud infrastructure. Help us scale our platform to handle thousands of users while maintaining high availability and security.",
		moreContext:
			"Experience with AWS, Docker, Kubernetes, and monitoring tools is essential. You'll also work on implementing security best practices and automated deployments.",
		documents: ["https://example.com/job-description-devops.pdf"],
	},
	{
		title: "Data Scientist",
		description:
			"Use data and machine learning to improve our recruiting algorithms and provide insights to our users. Help build the AI that makes recruiting more efficient.",
		moreContext:
			"Looking for experience with Python, machine learning frameworks, and statistical analysis. Knowledge of NLP and recommendation systems would be valuable.",
		documents: null,
	},
];

const demoApplicants = [
	{
		name: "Sofia Muller",
		image: "/example-data/people/sofia_muller.png",
		email: "sofia.muller@example.com",
		phone: "+1 408-555-0123",
		address: "345 Park Avenue, San Jose, CA 95110, USA",
		education: "BS Computer Science, Stanford University",
		experience:
			"5 years frontend development at Adobe, specializing in React and modern web technologies. Led the redesign of Creative Cloud web interface.",
		portfolioUrl: "https://sofiamuller.dev",
		travelWillingness: "Willing to travel up to 25%",
		resumeUrl: "https://example.com/resumes/sofia_muller.pdf",
		aiScore: 8.7,
		aiFlag: ApplicationFlag.GREAT,
		aiAssessment:
			"Exceptional candidate with strong technical skills and proven track record. 5+ years of relevant experience at a top-tier company. Portfolio demonstrates excellent UI/UX sensibilities and modern development practices. Strong cultural fit based on values alignment. Technical skills perfectly match our React/TypeScript stack requirements.",
		status: ApplicationStatus.SHORTLISTED,
		submissionData: {
			whyInterested:
				"I'm passionate about building tools that help people work more efficiently. Recruut's mission to streamline the hiring process really resonates with me.",
			biggestAchievement:
				"Led the frontend architecture redesign for Adobe Creative Cloud, resulting in 40% faster load times and 25% increase in user engagement.",
			workStyle:
				"I prefer collaborative environments with clear goals and regular feedback. I work best when I can balance independent problem-solving with team collaboration.",
		},
	},
	{
		name: "Thomas Clark",
		image: "/example-data/people/thomas_clark.png",
		email: "thomas.clark@example.com",
		phone: "+1 650-555-0456",
		address: "500 Oracle Parkway, Redwood City, CA 94065, USA",
		education: "MS Software Engineering, UC Berkeley",
		experience:
			"7 years full stack development at Oracle, with expertise in Node.js, PostgreSQL, and cloud architecture. Built enterprise-scale applications serving millions of users.",
		portfolioUrl: "https://thomasclark.tech",
		travelWillingness: "No travel preferred",
		resumeUrl: "https://example.com/resumes/thomas_clark.pdf",
		aiScore: 9.1,
		aiFlag: ApplicationFlag.GREAT,
		aiAssessment:
			"Outstanding full stack engineer with deep enterprise experience. Excellent database design skills and cloud architecture knowledge. Strong communication skills and leadership experience. Previous work at Oracle demonstrates ability to work with complex, large-scale systems. Perfect match for our technical requirements.",
		status: ApplicationStatus.REVIEWED,
		submissionData: {
			whyInterested:
				"I want to work on products that directly impact people's careers and lives. The recruiting space has huge potential for innovation.",
			biggestAchievement:
				"Designed and implemented a microservices architecture that improved system reliability by 99.9% and reduced deployment time by 80%.",
			workStyle:
				"I enjoy mentoring junior developers and believe in writing clean, maintainable code. I'm comfortable working in agile environments.",
		},
	},
	{
		name: "Mei Ling Chen",
		image: "/example-data/people/mei_ling_chen.png",
		email: "mei.ling.chen@example.com",
		phone: "+1 877-555-0789",
		address: "3401 Hillview Ave, Palo Alto, CA 94304, USA",
		education: "BFA Interaction Design, Art Center College of Design",
		experience:
			"4 years product design at VMware, focusing on enterprise software UX. Specialized in user research, prototyping, and design systems for complex B2B applications.",
		portfolioUrl: "https://meilingchen.design",
		travelWillingness: "Willing to travel as needed",
		resumeUrl: "https://example.com/resumes/mei_ling_chen.pdf",
		aiScore: 8.4,
		aiFlag: ApplicationFlag.HIGH_LEVEL,
		aiAssessment:
			"Strong design candidate with relevant B2B SaaS experience. Excellent portfolio showcasing user-centered design process and complex problem-solving. VMware experience demonstrates ability to work with enterprise software challenges. Good cultural fit and strong communication skills evident in application materials.",
		status: ApplicationStatus.SHORTLISTED,
		submissionData: {
			whyInterested:
				"I'm excited about the opportunity to improve the hiring experience for both recruiters and candidates. There's so much room for design innovation in this space.",
			biggestAchievement:
				"Led the design of VMware's new dashboard interface, which increased user productivity by 35% and received 95% positive feedback from enterprise clients.",
			workStyle:
				"I believe in data-driven design decisions and love collaborating with engineers and product managers. I'm most productive when I can validate designs with real users.",
		},
	},
	{
		name: "Gabriel Fischer",
		image: "/example-data/people/gabriel_fischer.png",
		email: "gabriel.fischer@example.com",
		phone: "+1 415-555-0321",
		address: "1355 Market Street, Suite 900, San Francisco, CA 94103, USA",
		education: "BS Computer Engineering, MIT",
		experience:
			"6 years DevOps and infrastructure at X (formerly Twitter), managing high-scale distributed systems. Expert in AWS, Kubernetes, and monitoring/alerting systems.",
		portfolioUrl: "https://gabrielfischer.cloud",
		travelWillingness: "Willing to travel occasionally",
		resumeUrl: "https://example.com/resumes/gabriel_fischer.pdf",
		aiScore: 8.9,
		aiFlag: ApplicationFlag.GREAT,
		aiAssessment:
			"Exceptional DevOps engineer with impressive high-scale experience at X. Strong technical skills in exactly the areas we need: AWS, Kubernetes, and monitoring. MIT education and 6 years of relevant experience. Excellent problem-solving abilities and proven track record with mission-critical infrastructure.",
		status: ApplicationStatus.REVIEWED,
		submissionData: {
			whyInterested:
				"I want to help build infrastructure that can scale with rapid growth. The challenge of supporting a growing SaaS platform really appeals to me.",
			biggestAchievement:
				"Reduced infrastructure costs by 40% while improving system reliability to 99.99% uptime during my time at X, serving 400M+ daily active users.",
			workStyle:
				"I prefer automation over manual processes and believe in building robust, self-healing systems. I work well with development teams to ensure smooth deployments.",
		},
	},
	{
		name: "Olivia Weber",
		image: "/example-data/people/olivia_weber.png",
		email: "olivia.weber@example.com",
		phone: "+1 408-555-0654",
		address: "170 West Tasman Dr, San Jose, CA 95134, USA",
		education: "PhD Machine Learning, Carnegie Mellon University",
		experience:
			"5 years data science at Cisco, building ML models for network optimization and predictive analytics. Published researcher in NLP and recommendation systems.",
		portfolioUrl: "https://oliviaweber.ai",
		travelWillingness: "Willing to travel for conferences",
		resumeUrl: "https://example.com/resumes/olivia_weber.pdf",
		aiScore: 9.3,
		aiFlag: ApplicationFlag.GREAT,
		aiAssessment:
			"Exceptional data scientist with PhD from CMU and strong industry experience. Published research in NLP and recommendation systems directly applicable to our AI initiatives. Cisco experience demonstrates ability to work with large-scale data systems. Outstanding technical qualifications and research background.",
		status: ApplicationStatus.SHORTLISTED,
		submissionData: {
			whyInterested:
				"I'm passionate about using AI to solve real-world problems. The opportunity to improve hiring through machine learning is incredibly exciting to me.",
			biggestAchievement:
				"Developed a recommendation system that improved network efficiency by 30% and was deployed across Cisco's global infrastructure, processing petabytes of data daily.",
			workStyle:
				"I enjoy the intersection of research and practical application. I like to validate models thoroughly and explain results clearly to non-technical stakeholders.",
		},
	},
	{
		name: "Lucia Bianchi",
		image: "/example-data/people/lucia_bianchi.png",
		email: "lucia.bianchi@example.com",
		phone: "+1 800-555-0987",
		address: "1455 Market Street, Suite 600, San Francisco, CA 94103, USA",
		education: "BS Computer Science, UC San Diego",
		experience:
			"3 years frontend development at Square, working on payment interfaces and financial dashboards. Experience with React, TypeScript, and payment systems.",
		portfolioUrl: "https://luciabianchi.dev",
		travelWillingness: "Willing to travel occasionally",
		resumeUrl: "https://example.com/resumes/lucia_bianchi.pdf",
		aiScore: 7.2,
		aiFlag: ApplicationFlag.NORMAL,
		aiAssessment:
			"Solid frontend developer with relevant experience at Square. Good technical skills in React and TypeScript. Portfolio shows clean, professional work. Slightly less experienced than ideal but demonstrates strong growth potential and enthusiasm. Cultural fit appears good based on application responses.",
		status: ApplicationStatus.SUBMITTED,
		submissionData: {
			whyInterested:
				"I want to work on products that help people find meaningful work. The technical challenges of building a modern recruiting platform are exciting.",
			biggestAchievement:
				"Built Square's new merchant onboarding flow, which reduced drop-off rates by 25% and improved the experience for small business owners.",
			workStyle:
				"I like working in fast-paced environments where I can learn from experienced team members. I'm detail-oriented and care about user experience.",
		},
	},
	{
		name: "Hugo Schmidt",
		image: "/example-data/people/hugo_schmidt.png",
		email: "hugo.schmidt@example.com",
		phone: "+1 212-555-0147",
		address:
			"4 World Trade Center, 150 Greenwich Street, New York, NY 10007, USA",
		education: "BS Information Systems, NYU",
		experience:
			"2 years junior developer at Spotify, working on music recommendation algorithms and web interfaces. Strong foundation in JavaScript and Python.",
		portfolioUrl: "https://hugoschmidt.codes",
		travelWillingness: "Open to relocation",
		resumeUrl: "https://example.com/resumes/hugo_schmidt.pdf",
		aiScore: 6.8,
		aiFlag: ApplicationFlag.NORMAL,
		aiAssessment:
			"Junior developer with good potential. Spotify experience is impressive for someone early in their career. Shows enthusiasm and willingness to learn. Technical skills are developing well, though may need mentorship. Good cultural fit and strong motivation evident in application.",
		status: ApplicationStatus.SUBMITTED,
		submissionData: {
			whyInterested:
				"I'm looking for an opportunity to grow my skills while working on meaningful problems. Recruiting technology can really impact people's lives.",
			biggestAchievement:
				"Contributed to Spotify's recommendation engine improvements that increased user engagement by 15% for my assigned user segment.",
			workStyle:
				"I'm eager to learn and take on new challenges. I work well in collaborative environments and enjoy pair programming and code reviews.",
		},
	},
	{
		name: "Victoria Ballard",
		image: "/example-data/people/victoria_ballard.png",
		email: "victoria.ballard@example.com",
		phone: "+1 800-555-0369",
		address: "1 Dell Way, Round Rock, TX 78682, USA",
		education: "MS Data Science, University of Texas at Austin",
		experience:
			"4 years data analysis at Dell, specializing in supply chain optimization and predictive modeling. Experience with Python, SQL, and cloud platforms.",
		portfolioUrl: "https://victoriaballard.data",
		travelWillingness: "Willing to relocate",
		resumeUrl: "https://example.com/resumes/victoria_ballard.pdf",
		aiScore: 7.9,
		aiFlag: ApplicationFlag.HIGH_LEVEL,
		aiAssessment:
			"Strong data science candidate with solid industry experience. Dell background in supply chain provides good analytical foundation. Technical skills align well with our data requirements. Shows good problem-solving abilities and business acumen. Would be valuable addition to the data team.",
		status: ApplicationStatus.REVIEWED,
		submissionData: {
			whyInterested:
				"I want to apply data science to help people find better job matches. The intersection of technology and human resources is fascinating to me.",
			biggestAchievement:
				"Built a predictive model that reduced supply chain costs by $2.3M annually and improved delivery times by 18% across Dell's global operations.",
			workStyle:
				"I enjoy translating complex data insights into actionable business recommendations. I work well with cross-functional teams and stakeholders.",
		},
	},
];

// Run the script if called directly
if (require.main === module) {
	populateDemoData()
		.then(() => {
			console.log("\n✨ Script completed successfully!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("\n💥 Script failed:", error);
			process.exit(1);
		});
}
