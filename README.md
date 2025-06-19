# Pokédex Web Application

A comprehensive Pokédex built with Vue 3, TypeScript, and Tailwind CSS. Browse, search, filter, and manage your favorite Pokémon with detailed information, evolution chains, and team management.

## Features

- 🔍 **Search & Filter**: Find Pokémon by name, number, or type
- 📋 **Sorting**: Sort by name (A-Z, Z-A) or number (ascending/descending)
- ❤️ **Favorites Management**: Save your favorite Pokémon
- 👥 **Team Builder**: Create teams of up to 6 Pokémon
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🖼️ **Image Gallery**: View multiple Pokémon images with lightbox
- 🔄 **Evolution Chains**: Explore Pokémon evolution paths
- 📊 **Detailed Stats**: View base stats, moves, and abilities
- 🌐 **SPA Routing**: Smooth navigation with Vue Router
- 💾 **Local Storage**: Persistent favorites and team data

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **API**: PokéAPI (pokeapi.co)
- **Deployment**: GitHub Pages

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Poke
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment to GitHub Pages

This application is configured for easy deployment to GitHub Pages.

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Set Source to "GitHub Actions"
4. The workflow will automatically build and deploy on every push to main

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Configuration

The application is pre-configured with:
- Base path set to `/Pokemon/` in `vite.config.ts`
- SPA routing support with 404.html redirect
- GitHub Actions workflow for automatic deployment
- Proper asset handling for GitHub Pages

## Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── icons/           # SVG icon components
│   ├── pokemon/         # Pokémon-specific components
│   └── common/          # Common UI components
├── composables/         # Vue composition functions
├── stores/              # Pinia state management
├── types/               # TypeScript type definitions
├── views/               # Page components
└── router/              # Vue Router configuration
```

## Key Components

- **HomeView**: Main page with search, filter, and Pokémon grid
- **PokemonDetailView**: Detailed Pokémon information page
- **TeamView**: Team management interface
- **FavouritesView**: Favorites management
- **PokemonStore**: Central state management for all Pokémon data

## API Integration

The application uses the [PokéAPI](https://pokeapi.co/) to fetch:
- Pokémon list and details
- Evolution chains
- Moves and abilities
- Sprites and artwork

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for the comprehensive Pokémon data
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
