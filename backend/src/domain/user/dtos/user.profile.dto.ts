import { z } from "zod";

// User Profile Request DTO
export const UserProfileRequestSchema = z.object({
  name: z.string().min(2).max(100),
  about: z.string().optional(),
  headline: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
});

export type UserProfileRequestDTO = z.infer<typeof UserProfileRequestSchema>;

// User Profile Response DTO
export const UserProfileResponseSchema = UserProfileRequestSchema.extend({
  id: z.string(),
  profileImage: z.string().url().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserProfileResponseDTO = z.infer<typeof UserProfileResponseSchema>;

// Profile Image Update DTO
export const ProfileImageUpdateSchema = z.object({
  imageUrl: z.string().url(),
});

export type ProfileImageUpdateDTO = z.infer<typeof ProfileImageUpdateSchema>;

// Education Request DTO
export const EducationRequestSchema = z.object({
  school: z.string().min(2).max(100),
  degree: z.string().min(2).max(50),
  fieldOfStudy: z.string().min(2).max(100),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string().optional(),
});

export type EducationRequestDTO = z.infer<typeof EducationRequestSchema>;

// Education Response DTO
export const EducationResponseSchema = EducationRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type EducationResponseDTO = z.infer<typeof EducationResponseSchema>;

// Experience Request DTO
export const ExperienceRequestSchema = z.object({
  company: z.string().min(2).max(100),
  position: z.string().min(2).max(50),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string().optional(),
});

export type ExperienceRequestDTO = z.infer<typeof ExperienceRequestSchema>;

// Experience Response DTO
export const ExperienceResponseSchema = ExperienceRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ExperienceResponseDTO = z.infer<typeof ExperienceResponseSchema>;

// Project Request DTO
export const ProjectRequestSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  projectUrl: z.string().url().nullable(),
});

export type ProjectRequestDTO = z.infer<typeof ProjectRequestSchema>;

// Project Response DTO
export const ProjectResponseSchema = ProjectRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProjectResponseDTO = z.infer<typeof ProjectResponseSchema>;

// Certificate Request DTO
export const CertificateRequestSchema = z.object({
  title: z.string().min(2).max(100),
  issuer: z.string().min(2).max(100),
  issueDate: z.string(),
  expirationDate: z.string().nullable(),
  certificateUrl: z.string().url().nullable(),
});

export type CertificateRequestDTO = z.infer<typeof CertificateRequestSchema>;

// Certificate Response DTO
export const CertificateResponseSchema = CertificateRequestSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CertificateResponseDTO = z.infer<typeof CertificateResponseSchema>;
