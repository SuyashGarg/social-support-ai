# Social Support AI

A React-based application for generating financial hardship statements using OpenAI's API.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- OpenAI API key
- Google Maps API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SuyashGarg/social-support-ai.git
cd social-support-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Setting Up API Keys

This application requires both OpenAI and Google Maps API keys to function properly.

### For Local Development

1. Create a `.env` file in the root directory:
```bash
touch .env
```

2. Add your API keys to `.env`:
```env
OPENAI_API_KEY=your-openai-api-key-here
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

**Important:** Never commit your `.env` file to version control. It should already be in `.gitignore`.

### For Vercel Deployment

If you're deploying to Vercel, you can set environment variables in two ways:

#### Option 1: Using Vercel CLI (Recommended for local Vercel development)

1. Install Vercel CLI globally (if not already installed):
```bash
npm install -g vercel
# or
yarn global add vercel
```

2. Pull environment variables from your Vercel project:
```bash
npx vercel env pull .env
```

This will download environment variables from your Vercel project and create a `.env` file.

#### Option 2: Using Vercel Dashboard

1. Go to your project settings in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add environment variables:
   - **Name:** `OPENAI_API_KEY`
     - **Value:** Your OpenAI API key
     - **Environment:** Select all environments (Production, Preview, Development)
   - **Name:** `VITE_GOOGLE_MAPS_API_KEY`
     - **Value:** Your Google Maps API key
     - **Environment:** Select all environments (Production, Preview, Development)
4. Redeploy your application for the changes to take effect

## Running the Project

### Local Development (Standard)

Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3001` (port configured in `vite.config.ts`).

### Local Development with Vercel

If you want to test the serverless functions locally with Vercel (For OpenAI):

1. Make sure you have Vercel CLI installed:
```bash
npm install -D vercel
# or
yarn add -D vercel
```

2. Run Vercel development server:
```bash
npm run vercel:dev
# or
yarn vercel:dev
```

This will start both the frontend and serverless functions locally, allowing you to test the OpenAI API integration.

## Building for Production

Build the project for production:
```bash
npm run build
# or
yarn build
```

The production build will be in the `dist` directory.

Preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

## Getting API Keys

### Getting an OpenAI API Key

If you don't have an OpenAI API key yet:

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key and add it to your `.env` file (for local development) or Vercel environment variables (for deployment)

**Note:** Keep your API key secure and never expose it in client-side code or commit it to version control.

### Getting a Google Maps API Key

If you don't have a Google Maps API key yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign up or log in to your account
3. Create a new project or select an existing one
4. Navigate to **APIs & Services** → **Library**
5. Search for "Maps JavaScript API" and enable it
6. Navigate to **APIs & Services** → **Credentials**
7. Click **Create Credentials** → **API Key**
8. Copy the key and add it to your `.env` file as `VITE_GOOGLE_MAPS_API_KEY` (for local development) or Vercel environment variables (for deployment)
9. (Recommended) Restrict the API key to only the APIs you need (Maps JavaScript API, Places API, etc.) and restrict it by HTTP referrer for web applications

**Note:** Keep your API key secure. While Google Maps API keys are used in client-side code, you should still restrict them appropriately to prevent unauthorized usage.

## Troubleshooting

### OpenAI API Key Not Working

- Ensure the API key is correctly set in your `.env` file (for local) or Vercel environment variables (for deployment)
- Verify the API key is valid and has sufficient credits
- Check that the environment variable name is exactly `OPENAI_API_KEY` (case-sensitive)
- For Vercel deployments, make sure you've redeployed after adding the environment variable

### Google Maps API Key Not Working

- Ensure the API key is correctly set in your `.env` file (for local) or Vercel environment variables (for deployment)
- Verify the API key is valid and has the required APIs enabled (Maps JavaScript API, Places API, etc.)
- Check that the environment variable name is exactly `VITE_GOOGLE_MAPS_API_KEY` (case-sensitive)
- Ensure your API key restrictions allow requests from your domain (for production) or localhost (for development)
- Check the browser console for specific error messages from Google Maps API
- For Vercel deployments, make sure you've redeployed after adding the environment variable

### Port Already in Use

If port 3001 is already in use, you can:
- Change the port in `vite.config.ts`
- Or kill the process using the port:
  ```bash
  # On macOS/Linux
  lsof -ti:3001 | xargs kill -9
  ```

## Code Quality & Git Hooks

This project uses **Husky** and **lint-staged** to ensure code quality before commits.

### Pre-commit Hooks

Before each commit, the following checks run automatically:
- **Linting**: ESLint checks all staged TypeScript/TSX files and auto-fixes issues
- **Full Lint Check**: Ensures no linting errors exist in the entire codebase
- **Tests**: Runs all tests to ensure nothing is broken

If any check fails, the commit will be blocked until issues are resolved.

### Bypassing Hooks (Not Recommended)

If you need to bypass hooks in an emergency (not recommended):
```bash
git commit --no-verify -m "your message"
```

**Note:** Only bypass hooks when absolutely necessary. The hooks are there to maintain code quality.

## Project Structure

- `src/` - React application source code
- `api/` - Serverless API functions (for Vercel deployment)
- `public/` - Static assets
- `dist/` - Production build output
- `.husky/` - Git hooks configuration