# Click & Quote

A modern web application for electrical quotation management, designed to streamline the process of creating, managing, and tracking electrical service quotations.

## 🚀 Features

### Core Functionality
- **Quotation Management**: Create, edit, duplicate, and track electrical service quotations
- **Template System**: Pre-built templates for different types of electrical work (UK Power Networks, Industrial Lighting, etc.)
- **Interactive Map View**: Visualize quotation locations with Leaflet integration
- **User Management**: Role-based access control (Admin/User roles)
- **Dashboard Analytics**: Overview of quotations, revenue tracking, and performance metrics
- **Document Generation**: Professional quotation documents with company branding

### Key Features
- **Real-time Status Tracking**: Monitor quotation status (Draft, Submitted, Approved, Rejected, Accepted)
- **Geographic Integration**: Create quotations directly from map locations
- **Activity History**: Track all user actions and quotation changes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Authentication**: Secure JWT-based authentication system
- **RESTful API**: FastAPI backend with comprehensive endpoints

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Leaflet** - Interactive maps
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Recharts** - Data visualization and charts

### Backend
- **FastAPI 0.104.1** - Modern Python web framework
- **SQLAlchemy 2.0.23** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Uvicorn** - ASGI server
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation and serialization

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Copy and modify the .env file
cp .env.example .env
```

5. Start the backend server:
```bash
python run_server.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4028`

## 🔧 Configuration

### Backend Configuration (.env)
```env
PROJECT_NAME="Click & Quote API"
PROJECT_VERSION="1.0.0"
DEBUG=true

# Database
DATABASE_URL="sqlite:///./clickquote.db"

# Security
SECRET_KEY="your-secret-key-here-change-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Demo Credentials
- **Admin**: `admin@clickquote.com` / `Admin@123`
- **User**: `user@clickquote.com` / `User@123`
- **Test User**: `test@example.com` / `testpass123`

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/quotations/` - List quotations
- `POST /api/v1/quotations/` - Create quotation
- `GET /api/v1/templates/` - List templates
- `GET /api/v1/users/me` - Get current user profile

## 🏗️ Project Structure

```
click-quote/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models
│   │   └── schemas/        # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── run_server.py      # Server startup script
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   │   ├── dashboard/     # Dashboard page
│   │   ├── create-quotation/ # Quotation creation
│   │   ├── quotation-details/ # Quotation details
│   │   ├── map-view/      # Interactive map
│   │   └── template-management/ # Template management
│   ├── styles/            # CSS styles
│   └── utils/             # Utility functions
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## 🎯 Usage

### Creating a Quotation
1. Navigate to **Create Quotation** from the dashboard
2. Fill in customer details and project information
3. Select or create a template
4. Add line items and pricing
5. Preview and save the quotation

### Using the Map View
1. Go to **Map View** to see all quotation locations
2. Click on markers to view quotation details
3. Create new quotations by clicking on the map
4. Use polygon tools to define service areas

### Managing Templates
1. Access **Template Management** (Admin only)
2. Create reusable templates for common services
3. Organize templates by category and type
4. Duplicate and modify existing templates

## 🔒 Security Features

- JWT-based authentication with secure token handling
- Role-based access control (Admin/User permissions)
- Password hashing with industry-standard algorithms
- CORS protection for cross-origin requests
- Input validation and sanitization

## 🚀 Deployment

### Production Considerations
1. Change the `SECRET_KEY` in production
2. Use a production database (PostgreSQL recommended)
3. Set `DEBUG=false` in production
4. Configure proper CORS origins
5. Use HTTPS in production
6. Set up proper logging and monitoring

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: info@clickquote.com
- Phone: (555) 123-4567
- Create an issue in this repository

## 🔄 Version History

- **v1.0.0** - Initial release with core quotation management features
- **v0.1.0** - Development version with basic functionality

---

**Click & Quote** - Streamlining electrical quotation management for modern businesses.
