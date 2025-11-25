# TechTrix Tournament Tracker

This is a Next.js web application for displaying a real-time leaderboard for the TechTrix tech competition. It includes a public leaderboard and a secure admin panel for managing teams and scores, all powered by Firebase.

The UI is designed with a dark, futuristic theme with neon highlights, inspired by the TechTrix event poster.

## Features

- **Real-time Leaderboard**: View team rankings, scores, and details, updated live from Firebase.
- **Secure Admin Panel**: A password-protected area for event organizers.
- **Team Management**: Admins can add new teams to the competition.
- **Score Updates**: Admins can update scores for each round for all teams.
- **Manual Tie-Breaking**: Admins can manually set a rank for teams with tied scores.
- **Event Reset**: A secure feature for admins to clear all leaderboard data after a confirmation.
- **Responsive Design**: The interface is optimized for desktops, projectors, and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with React)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore and Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

## Setup and Deployment

Follow these steps to get the application running.

### 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the on-screen instructions to create a new project.

### 2. Set up Firebase Services

In your new Firebase project's console:

1.  **Authentication**:
    *   Go to the **Authentication** section.
    *   Click **"Get started"**.
    *   Under the **"Sign-in method"** tab, enable the **"Email/Password"** provider.
    *   Go to the **"Users"** tab and click **"Add user"**. Create an account for your admin (e.g., `admin@example.com`). This email and password will be used to log in to the admin panel.

2.  **Firestore Database**:
    *   Go to the **Firestore Database** section.
    *   Click **"Create database"**.
    *   Start in **production mode**.
    *   Choose a location for your database.
    *   Click **"Enable"**.

### 3. Configure Firebase in Your App

1.  In the Firebase console, go to **Project Settings** (click the gear icon ⚙️ next to "Project Overview").
2.  In the **"General"** tab, scroll down to **"Your apps"**.
3.  Click the web icon (`</>`) to create a new web app.
4.  Register your app (give it a nickname) and click **"Register app"**.
5.  Firebase will provide you with a `firebaseConfig` object. Copy these keys and values.

6.  In the project root, create a new file named `.env.local`.

7.  Paste your Firebase config and your admin email into `.env.local` like this:

    ```
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

    # Admin Configuration
    # The email address of the user you created in Firebase Auth
    NEXT_PUBLIC_ADMIN_EMAIL=YOUR_ADMIN_EMAIL@example.com
    ```

### 4. Set up Firestore Security Rules

1.  In the Firebase console, go to the **Firestore Database** section and click on the **"Rules"** tab.
2.  Replace the default rules with the content from the `firestore.rules` file in this project. This will make the `teams` collection publicly readable but writable only by the authenticated admin.
3.  **Important**: In the rules, replace `"YOUR_ADMIN_EMAIL@example.com"` with the actual admin email you are using.
4.  Click **"Publish"**.

### 5. Install Dependencies and Run Locally

1.  Open your terminal in the project root.
2.  Install the necessary packages:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the app.

### 6. Deploy to Firebase Hosting

1.  Install the Firebase CLI if you haven't already:
    ```bash
    npm install -g firebase-tools
    ```
2.  Log in to Firebase:
    ```bash
    firebase login
    ```
3.  Initialize Firebase in your project directory:
    ```bash
    firebase init hosting
    ```
    *   Select **"Use an existing project"** and choose the Firebase project you created.
    *   When asked for your public directory, enter `.next`. **This is incorrect for modern Next.js App Router with output exports. The correct directory is `out`.** First, you'll need to configure your `next.config.ts` to output static files by adding `output: 'export'`. Then run `npm run build` which will generate an `out` directory. When initializing hosting, specify `out` as the public directory.
    *   Configure as a single-page app (rewrite all URLs to /index.html)? **Yes**.

4.  Build your Next.js app for production:
    ```bash
    npm run build
    ```

5.  Deploy to Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```

Your app will be live at the URL provided by Firebase.
