import { NextResponse } from "next/server";
import { JobListing } from "@/types";

const MOCK_JOBS: JobListing[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    title: "Junior Backend Developer (.NET Core)",
    company: "Bitcube",
    location: "Bloemfontein",
    employmentType: "FullTime",
    salaryMin: 25000,
    salaryMax: 35000,
    postedAt: new Date().toISOString(),
    isActive: true,
    applicantCount: 14,
    description: "Join our dynamic backend team at Bitcube. You'll be working on highly scalable .NET Core microservices, improving API performance, and integrating with third-party payment gateways. We value clean architecture and test-driven development."
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
    title: "Frontend Web Developer (React)",
    company: "TechBridge Solutions",
    location: "Remote",
    employmentType: "Contract",
    salaryMin: 40000,
    salaryMax: 60000,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    applicantCount: 0,
    description: "We need an expert React developer for a 6-month contract to rebuild our core client dashboard. You must be comfortable with Next.js, TailwindCSS, and TanStack Query. Remote candidates in the SAST time zone are preferred."
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-789abcdef012",
    title: "Software Development Intern",
    company: "Innovate Pretoria",
    location: "Pretoria",
    employmentType: "Internship",
    salaryMin: 8000,
    salaryMax: 12000,
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    applicantCount: 89,
    description: "Kickstart your career with our intensive 12-week software engineering internship. You will rotate across QA, Frontend, and Backend teams. Mentorship provided. Applicants must have completed a relevant IT degree or diploma."
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-89abcdef0123",
    title: "Database Administrator (PostgreSQL)",
    company: "DataSys SA",
    location: "Johannesburg",
    employmentType: "FullTime",
    salaryMin: 55000,
    salaryMax: 75000,
    postedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    applicantCount: 5,
    description: "DataSys SA is seeking an experienced PostgreSQL DBA to manage our high-availability clusters. Responsibilities include query optimization, backup strategies, and migration of legacy on-prem databases to AWS RDS."
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-9abcdef01234",
    title: "IT Support Specialist",
    company: "Spur Corporation",
    location: "Cape Town",
    employmentType: "PartTime",
    salaryMin: 15000,
    salaryMax: 22000,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    applicantCount: 42,
    description: "Part-time IT support role for our regional head office. You will be responsible for setting up workstations, troubleshooting network issues, and providing L1 helpdesk support to our staff. Flexible hours available."
  },
  {
    id: "f6a7b8c9-d0e1-2345-6789-abcdef012345",
    title: "Senior Full Stack Engineer",
    company: "FinTech Africa",
    location: "Remote",
    employmentType: "FullTime",
    salaryMin: 80000,
    salaryMax: 110000,
    postedAt: new Date().toISOString(),
    isActive: true,
    applicantCount: 3,
    description: "Lead the development of our next-generation mobile banking platform. You will be working across the entire stack using Node.js, React Native, and AWS. We are looking for an architectural thinker who can mentor junior developers."
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const job = MOCK_JOBS.find(j => j.id === id);
  
  if (!job) {
    return NextResponse.json(
      { title: "Not Found", detail: "Job not found", status: 404 },
      { status: 404 }
    );
  }
  
  return NextResponse.json(job);
}

export async function POST() {
  return NextResponse.json(
    { title: "Method Not Allowed", detail: "Use GET or PATCH", status: 405 },
    { status: 405 }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { title: "Bad Request", detail: "Invalid JSON", status: 400 },
      { status: 400 }
    );
  }
  
  const jobIndex = MOCK_JOBS.findIndex(j => j.id === id);
  
  if (jobIndex === -1) {
    return NextResponse.json(
      { title: "Not Found", detail: "Job not found", status: 404 },
      { status: 404 }
    );
  }
  
  if (body.status === "Closed") {
    MOCK_JOBS[jobIndex].isActive = false;
  } else if (body.status === "Active") {
    MOCK_JOBS[jobIndex].isActive = true;
  }
  
  return NextResponse.json(MOCK_JOBS[jobIndex]);
}
