# ENVILE POLYTECHNIC — BAM223 ATTENDANCE (Firebase v1)

This version is connected in code to the Firebase project:
envile-bam223-attendance

It uses Cloud Firestore for attendance records.

## Important setup
1. In Firebase Console, create a Firestore Database.
2. For initial testing, use test mode only temporarily.
3. Deploy this folder to a web host or run it from a local development server.
4. Before real student use, add proper authentication and Firestore security rules.

## Current database
Collection: attendance
Document ID format: MATRIC_DATE
Example: P24/ND43003_2026-07-27

## Demo admin
Username: admin
Password: admin123

The demo admin password is only inside the front-end prototype and is NOT secure for real production use. The next security upgrade should use Firebase Authentication and protected admin roles.
