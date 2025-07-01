# Masas Customer Dashboard

A modern, responsive customer management dashboard built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## 🚀 Features

- **Customer Management**: View and manage customer data with detailed information
- **Advanced Filtering**: Filter customers by industry, country, compatibility scores, and more
- **Multi-Select Filters**: Select multiple industries and countries for comprehensive filtering
- **Real-time Search**: Fast and responsive search functionality
- **Expandable Rows**: Click to expand customer details
- **Social Media Integration**: Direct links to customer social media profiles
- **Email History**: View customer email history in modal dialogs
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built with shadcn/ui for theme support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React Icons
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/asedra/masas_project.git
cd masas_project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_PORT=5432
DB_NAME=masasdb
```

### 4. Database Setup

Run the database setup script:

```bash
python setup_env.py
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
masascustomers/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── customer-dashboard.tsx
├── lib/                  # Utility functions
│   ├── database.ts       # Database connection
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
├── data/                 # Mock data and schemas
└── config.py             # Database configuration
```

## 🔧 Configuration

### Database Configuration

The application connects to a PostgreSQL database. Update the connection settings in `config.py`:

```python
DB_CONFIG = {
    'host': 'your_host',
    'port': 5432,
    'database': 'masasdb',
    'user': 'your_username',
    'password': 'your_password'
}
```

### Environment Variables

- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name

## 🎨 Customization

### Styling

The application uses Tailwind CSS with shadcn/ui components. You can customize the theme by modifying:

- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - Global styles and CSS variables

### Components

All UI components are located in `components/ui/` and follow shadcn/ui patterns. You can customize or add new components as needed.

## 📊 Database Schema

The application uses the following database tables:

- `customers` - Customer information
- `customer_classifications` - Customer compatibility scores
- `dorks` - Search queries and country information
- `industries` - Industry classifications
- `email` - Email history

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/asedra/masas_project/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library 