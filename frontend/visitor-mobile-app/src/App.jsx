import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { QrCode, MapPin, CreditCard, Clock, Star, Users, Ticket, Bell } from 'lucide-react'
import './App.css'

// Mock data for demonstration
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  tickets: [
    {
      id: '1',
      type: 'Single Day Pass',
      date: '2025-09-07',
      qrCode: 'QR_JOHN_DOE_20250907_001',
      status: 'valid'
    }
  ]
}

const mockAttractions = [
  {
    id: '1',
    name: 'Thunder Mountain Coaster',
    category: 'Thrill Rides',
    waitTime: 15,
    status: 'open',
    rating: 4.8,
    description: 'High-speed roller coaster with thrilling drops and turns'
  },
  {
    id: '2',
    name: 'Family Fun Carousel',
    category: 'Family Rides',
    waitTime: 5,
    status: 'open',
    rating: 4.2,
    description: 'Classic carousel ride suitable for all ages'
  },
  {
    id: '3',
    name: 'Adventure Water Rapids',
    category: 'Water Rides',
    waitTime: 25,
    status: 'open',
    rating: 4.6,
    description: 'Exciting water ride through rapids and waterfalls'
  },
  {
    id: '4',
    name: 'Space Mission Simulator',
    category: 'VR Experiences',
    waitTime: 0,
    status: 'maintenance',
    rating: 4.9,
    description: 'Virtual reality space exploration experience'
  }
]

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - in real app, this would call an API
    onLogin(mockUser)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <QrCode className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Theme Park QR</CardTitle>
          <CardDescription>Welcome back! Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Demo credentials: any email/password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TicketCard({ ticket }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{ticket.type}</h3>
            <p className="text-muted-foreground">{ticket.date}</p>
          </div>
          <Badge variant={ticket.status === 'valid' ? 'default' : 'secondary'}>
            {ticket.status}
          </Badge>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <QrCode className="w-24 h-24 mx-auto mb-2" />
          <p className="text-sm font-mono">{ticket.qrCode}</p>
        </div>
        <Button className="w-full mt-4">
          <Ticket className="w-4 h-4 mr-2" />
          Show QR Code
        </Button>
      </CardContent>
    </Card>
  )
}

function AttractionCard({ attraction }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500'
      case 'maintenance': return 'bg-red-500'
      case 'closed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 10) return 'text-green-600'
    if (waitTime <= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{attraction.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{attraction.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{attraction.category}</Badge>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm">{attraction.rating}</span>
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(attraction.status)}`}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className={`text-sm font-medium ${getWaitTimeColor(attraction.waitTime)}`}>
              {attraction.status === 'maintenance' ? 'Under Maintenance' : `${attraction.waitTime} min wait`}
            </span>
          </div>
          <Button 
            size="sm" 
            disabled={attraction.status !== 'open'}
            className="ml-2"
          >
            <Users className="w-4 h-4 mr-1" />
            Join Queue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MainApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('attractions')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Theme Park QR</h1>
            <p className="text-sm opacity-90">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attractions">
              <MapPin className="w-4 h-4 mr-1" />
              Attractions
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <Ticket className="w-4 h-4 mr-1" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-1" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Users className="w-4 h-4 mr-1" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attractions" className="mt-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Park Attractions</h2>
              <p className="text-muted-foreground">Discover amazing rides and experiences</p>
            </div>
            {mockAttractions.map(attraction => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </TabsContent>

          <TabsContent value="tickets" className="mt-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">My Tickets</h2>
              <p className="text-muted-foreground">Your active park tickets</p>
            </div>
            {user.tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
            <Button className="w-full mt-4" variant="outline">
              <Ticket className="w-4 h-4 mr-2" />
              Buy New Ticket
            </Button>
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
              <p className="text-muted-foreground">Manage your payment options</p>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-muted-foreground">Visa ending in 1234</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('themepark_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('themepark_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('themepark_user')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        {user ? (
          <MainApp user={user} onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
    </Router>
  )
}

export default App

