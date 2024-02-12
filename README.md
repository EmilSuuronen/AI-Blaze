# AI-blaze
AI-blaze is an web application built on React and designed to transform hand-drawn wireframes into editable HTML and CSS code. Leveraging the power of AI, it offers an interface for novice/non-techical users to see and edit instant recreations of their wireframe projects. This project integrates a Node.js backend, React frontend, Firebase database, and utilizes GPT-3.5 and GPT-4 Vision Preview for generation.

## Features
- **Wireframe to Code Conversion**: Users can upload hand-drawn wireframe images, which are converted into HTML and CSS code using ChatGPT 3.5 and GPT-4 Vision Preview.
- **Generation**: Generation can be done automatically or by labeling elements in an image by hand.
- **Editable Preview Interface**: Edit generated project and auto generate text elements with AI.
- **Firebase Database Integration**: Projects are saved and managed in a Firebase database.
- **Secure Authentication**: Users can sign in using credentials or their Google account for a personal project storage.

## Getting Started
### Prerequisites
- Node.js
- React
- API access required for the following
- ChatGPT 3.5 and GPT-4 Vision Preview for AI-powered code generation.
- Firebase for database services.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/EmilSuuronen/AI-Blaze.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project.
   - Configure the Firebase .env settings and configuration for the project in /client.

4. You will need an Chat GPT api key from here [platform.openai.com](https://platform.openai.com/)
   - Create an .env file in /server folder with variable: OPENAI_CHATGPT_API_KEY=YOUR_API_KEY_HERE

6. Run the application:
   run the React Frontend
   ```bash
   cd client
   npm start
   ```
   run the backend server locally
   ```bash
   cd server
   npm run dev
   ```

## Images
![alt text](https://github.com/EmilSuuronen/AI-Blaze/blob/main/res/Login.png)
![alt text](https://github.com/EmilSuuronen/AI-Blaze/blob/main/res/home.png)
### Create and edit designs
![alt text](https://github.com/EmilSuuronen/AI-Blaze/blob/main/res/createProject.png)
![alt text](https://github.com/EmilSuuronen/AI-Blaze/blob/main/res/editor.png)

