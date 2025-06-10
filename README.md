# MP4 Upload to Make.com WebHook

This is a simple React app that allows users to upload MP4 files to a Make.com webhook. The app collects user information (Name, Surname, Email) and sends it along with the uploaded file to the webhook for further processing in Make.com.

## Features

- Dark theme UI
- Form validation for user inputs
- MP4 file upload with type and size validation
- Integration with Make.com webhook
- Responsive design

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- pnpm (or npm/yarn)

### Installation

1. Clone this repository:
   ```
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Run the development server:
   ```
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment to Vercel

### Option 1: Deploy directly from GitHub

1. Push your code to a GitHub repository.

2. Go to [Vercel](https://vercel.com) and sign up or log in.

3. Click on "New Project" and import your GitHub repository.

4. Configure your project:
   - Framework Preset: Vite
   - Build Command: pnpm build (or let Vercel detect it automatically)
   - Output Directory: dist
   - Install Command: pnpm install

5. Click "Deploy" and wait for the deployment to complete.

### Option 2: Deploy using Vercel CLI

1. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Navigate to your project directory and run:
   ```
   vercel
   ```

4. Follow the prompts to configure your deployment.

5. For subsequent deployments, you can use:
   ```
   vercel --prod
   ```

## Make.com Integration

The app sends data to the Make.com webhook at:
`https://hook.eu2.make.com/cfhuapql1sqjdtl6alviiihhgcnkbeg3`

The webhook receives the following data in FormData format:
- name: User's first name
- surname: User's surname
- email: User's email address
- file: The uploaded MP4 file

You can configure your Make.com scenario to process this data and upload it to Dropbox or perform other actions.

## Customization

- To change the webhook URL, modify the `webhookUrl` variable in `src/utils/fileUpload.js`
- Adjust the maximum file size in `src/components/UploadForm.jsx` (currently set to 100MB)