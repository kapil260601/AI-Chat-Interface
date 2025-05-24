# AI Chat Interface

Hey there!,this is my AI chat interface project. I built this using React, TypeScript, and Material UI to create a solid chat platform that handles real-time messaging, file uploads, and custom AI agents.

## What's Inside

-  Real-time chat with message streaming
-  Custom AI agents you can create and configure
-  Organize chats into folders
-  Search through your chat history
-  Upload files (PDF, PNG, JPG, DOCX)
-  Switch between light and dark modes
-  Works great on all devices

## Tech I Used

I picked these technologies based on my experience with what works well in production:

- React 18 + TypeScript for a solid foundation
- Material UI for clean, professional components
- Context API + useReducer for state management
- React Router for navigation
- Tailwind CSS for quick styling
- Lucide React for icons
- React Markdown for message formatting
- Browser's File API for uploads
- LocalStorage for saving data

## Getting Started

1. Clone the repo:
   ```bash
   git clone <repository-url>
   cd ai-chat-interface
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser and you're good to go!

## Project Structure

I organized the code into clear folders to keep things maintainable:

```
src/
├── components/     # UI components
│   ├── agent/     # Agent creation and management
│   ├── chat/      # Chat interface components
│   ├── layout/    # Page layout stuff
│   └── sidebar/   # Sidebar navigation
├── context/       # React Context for state
├── services/      # Helper services
├── theme/         # MUI theme setup
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Main Features

### Chat Interface
- Split-screen layout with folders on the left and chat on the right
- Messages stream in real-time as they're generated
- Code blocks with syntax highlighting
- File upload previews
- Loading indicators while the AI is thinking

### Agent Builder
- Create custom AI agents for different tasks
- Set up their system prompts
- Choose between GPT-3.5 and GPT-4
- Adjust temperature settings for response variety

### Workspace Tools
- Create folders to organize your chats
- Move chats between folders
- Search all your conversations
- Save important chats

## How It Works

I used React's Context API with useReducer to manage the app's state. This keeps track of:

- Chat messages and history
- Folder organization
- AI agent settings
- UI preferences like dark mode

## File Uploads

The app handles these file types:
- Images (JPG, PNG) with previews
- Documents (PDF, DOCX)
- Checks file size and type before upload
- Shows progress and error states

## Design

I spent time making sure the app looks and feels professional:
- Clean Material UI theme
- Dark and light modes
- Consistent spacing and colors
- Works well on mobile

## Development Notes

I followed these practices to keep the code clean and maintainable:
- TypeScript for type safety
- ESLint for code quality
- Component-based structure
- Error handling throughout
- Performance optimizations where needed
- Responsive design
- Accessibility features

Feel free to check out the code and let me know if you have any questions! I'm always open to feedback and suggestions for improvement.