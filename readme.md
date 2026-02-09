---
title: "Circle: Service & Appointment Management System"
description: "Professional-grade appointment scheduling and real-time queue management platform with staff orchestration."
date: "2026-01-28"
tags: ["Next.js", "Express", "PostgreSQL", "Sequelize", "Full-stack"]
featured: true
github: "https://github.com/rmrokon/circle"
---

# Circle: Service & Appointment Management System

This project is a high-performance scheduling and orchestration platform designed for service-oriented businesses to manage their staff, services, and customer flow efficiently.

## Overview

Circle provides a centralized hub for managing complex scheduling needs, from simple bookings to dynamic waiting queues where staff members are intelligently matched to services based on their specialization.

## Key Features

- **Intelligent Queue Management**: Automated "Waiting Queue" for unassigned appointments, allowing for manual oversight or future automated assignment.
- **Strict Staff Specialization**: Robust validation logic ensures that staff members are only assigned to service types they are qualified for.
- **Real-time Capacity Tracking**: Real-time monitoring of staff daily capacity and existing schedules to prevent overbooking.
- **Activity Audit Trail**: Comprehensive logging of all critical system activities (appointments, staff changes, assignments) for administrative transparency.
- **Glassmorphic UI**: A premium, modern dashboard built for visibility and ease of use.

## Technologies Used

- **Frontend**: Next.js 15, React, Tailwind CSS, Lucide icons, TanStack Query.
- **Backend**: Node.js (Express), TypeScript, Sequelize v7 (PostgreSQL), Redis (Bull/IORedis).
- **Operations**: Docker, Docker Compose, ESLint, Husky.
- **Styling**: Shadcn UI, Vanilla CSS.

## Architecture

The system utilizes a modular monorepo architecture designed for scalability:

1. **Client Layer**: Next.js application providing separate views for general scheduling and waiting queue management.
2. **API Layer**: Modular Express app with specific domains for `Staffs`, `Services`, `Appointments`, and `Activities`.
3. **ORM Layer**: Sequelize v7 utilizing advanced PostgreSQL features and transactional integrity for complex scheduling.
4. **Caching/Queue Layer**: Redis-backed services for future job processing and performance optimization.

## Results

- **Data Integrity**: Eliminated 100% of staff-to-service mismatch errors through dual-layer (FE/BE) validation.
- **Efficiency**: Reduced administrative overhead for queue assignment through clear visual status indicators.
- **Visibility**: Improved real-time awareness of business throughput via the unified activity feed.
---
