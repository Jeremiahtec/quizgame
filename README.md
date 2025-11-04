# QuizGame - Kahoot Clone

An interactive quiz platform built with Next.js, React, and Tailwind CSS.

## Features

- **Quiz Builder**: Create custom quizzes with multiple-choice questions
- **Live Gameplay**: Real-time multiplayer quiz games with countdown timers
- **Game Lobby**: Host games with unique PIN codes for players to join
- **Scoring System**: Points awarded based on speed and accuracy
- **Leaderboard**: Animated podium display with final rankings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

### As a Host:
1. Click "Create Quiz" on the homepage
2. Add your quiz title and questions with 4 answer choices each
3. Mark the correct answer for each question
4. Click "Start Game" to generate a game PIN
5. Share the PIN with players
6. Wait for players to join, then click "Start" to begin

### As a Player:
1. Click "Join Game" on the homepage
2. Enter the game PIN provided by the host
3. Enter your name
4. Wait in the lobby for the host to start
5. Answer questions as fast as you can for maximum points!

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS v4
- **Components**: shadcn/ui, Radix UI
- **State Management**: SWR for real-time sync
- **Icons**: Lucide React
- **Animations**: canvas-confetti

## Project Structure

\`\`\`
app/
├── page.tsx              # Homepage
├── create/               # Quiz builder
├── lobby/                # Host lobby
├── join/                 # Player join flow
├── waiting/              # Player waiting room
├── play/                 # Live gameplay
└── results/              # Final leaderboard

components/
├── quiz-builder.tsx      # Quiz creation interface
├── game-lobby.tsx        # Host lobby component
├── join-game.tsx         # Player join component
├── waiting-room.tsx      # Player waiting component
├── game-play.tsx         # Gameplay interface
├── game-results.tsx      # Results/leaderboard
└── game-header.tsx       # Reusable header

lib/
├── game-store.ts         # State management hooks
└── utils.ts              # Utility functions
\`\`\`

## State Management

The app uses SWR for real-time state synchronization between host and players via localStorage. In a production environment, this would be replaced with WebSockets or a real-time database like Supabase.

## Future Enhancements

- Real-time backend with WebSockets
- User authentication and quiz library
- Image support for questions
- Multiple game modes
- Analytics and statistics
- Mobile app version

## License

MIT
