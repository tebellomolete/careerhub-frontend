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
  }
];

export async function GET() {
  return NextResponse.json(MOCK_JOBS);
}
