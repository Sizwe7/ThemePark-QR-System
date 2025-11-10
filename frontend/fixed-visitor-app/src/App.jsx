import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { QrCode, Ticket, CreditCard, MapPin, Clock, Users, Star, Camera, Smartphone, Trash2, UserX, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0821234567', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0829876543', status: 'active' }
  ])

  // Sample attractions data
  const attractions = [
    { id: 1, name: 'Thunder Mountain', waitTime: 25, rating: 4.8, type: 'Roller Coaster' },
    { id: 2, name: 'Splash Rapids', waitTime: 15, rating: 4.6, type: 'Water Ride' },
    { id: 3, name: 'Space Adventure', waitTime: 35, rating: 4.9, type: 'Dark Ride' },
    { id: 4, name: 'Carousel Dreams', waitTime: 5, rating: 4.3, type: 'Family Ride' },
    { id: 5, name: 'Wild Safari', waitTime: 20, rating: 4.7, type: 'Adventure' }
  ]

  // FIXED: Updated ticket types with South African Rand (R) and proper pricing
  const ticketTypes = [
    { id: 1, name: 'Day Pass', price: 350, description: 'Access to all attractions for one day' },
    { id: 2, name: 'Standard', price: 250, description: 'Standard access to most attractions' },
    { id: 3, name: 'VIP', price: 650, description: 'Skip-the-line access + all attractions + exclusive areas' }
  ]

  // FIXED: Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // FIXED: Phone validation function (South African format)
  const validatePhone = (phone) => {
    const phoneRegex = /^0[0-9]{9}$/
    return phoneRegex.test(phone)
  }

  // FIXED: Registration function with proper validation and error messages
  const handleRegister = (name, email, phone, password) => {
    setError('')
    setSuccess('')

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    // Validate phone number (must be numeric and 10 digits starting with 0)
    if (!validatePhone(phone)) {
      setError('Phone number must be 10 digits starting with 0 (e.g., 0821234567)')
      return false
    }

    // Check for duplicate email
    const emailExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      setError('An account with this email already exists. Please use a different email or try logging in.')
      return false
    }

    // Check password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    // Register user
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      status: 'active',
      membershipLevel: 'Standard'
    }
    setRegisteredUsers([...registeredUsers, newUser])
    setSuccess('Registration successful! You can now log in.')
    return true
  }

  // FIXED: Login function with error handling
  const handleLogin = (email, password) => {
    setError('')
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) {
      setError('No account found with this email. Please check your email or register.')
      return false
    }

    if (foundUser.status === 'inactive') {
      setError('Your account has been deactivated. Please contact support.')
      return false
    }

    // Simulate login
    setUser({ 
      ...foundUser,
      membershipLevel: foundUser.membershipLevel || 'Standard'
    })
    setSuccess('Login successful!')
    return true
  }

  // FIXED: Admin login function
  const handleAdminLogin = (email, password) => {
    setError('')
    
    // Proper admin authentication (in production, this would check against database)
    if (email === 'admin@adventurepark.com' && password === 'admin123') {
      setIsAdmin(true)
      setUser({
        id: 0,
        name: 'Administrator',
        email: email,
        membershipLevel: 'Admin'
      })
      setSuccess('Admin login successful!')
      return true
    } else {
      setError('Invalid admin credentials')
      return false
    }
  }

  // NEW: Password recovery function
  const handlePasswordReset = (email) => {
    setError('')
    setSuccess('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (!userExists) {
      setError('No account found with this email address')
      return false
    }

    // Simulate sending password reset email
    setSuccess(`Password reset instructions have been sent to ${email}`)
    return true
  }

  // NEW: User management functions for admin
  const deactivateUser = (userId) => {
    setRegisteredUsers(registeredUsers.map(u => 
      u.id === userId ? { ...u, status: 'inactive' } : u
    ))
    setSuccess('User account deactivated successfully')
  }

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      setRegisteredUsers(registeredUsers.filter(u => u.id !== userId))
      setSuccess('User account deleted successfully')
    }
  }

  const reactivateUser = (userId) => {
    setRegisteredUsers(registeredUsers.map(u => 
      u.id === userId ? { ...u, status: 'active' } : u
    ))
    setSuccess('User account reactivated successfully')
  }

  // FIXED: Purchase ticket function with auto-populated pricing
  const purchaseTicket = (ticketTypeId, paymentMethod) => {
    const ticketType = ticketTypes.find(t => t.id === ticketTypeId)
    if (!ticketType) {
      setError('Invalid ticket type selected')
      return
    }

    const newTicket = {
      id: Date.now(),
      type: ticketType.name,
      price: ticketType.price, // Price is auto-populated, not user-entered
      purchaseDate: new Date().toLocaleDateString(),
      qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Active',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()
    }
    setTickets([...tickets, newTicket])
    setSelectedTicket(newTicket)
    setQrCode(newTicket.qrCode)
    setSuccess(`Ticket purchased successfully! Total: R${ticketType.price}`)
  }

  // Generate QR Code display
  const generateQRDisplay = (code) => {
    return (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
          <div className="text-center">
            <QrCode size={80} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500 font-mono">{code}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Show this QR code at park entrance
        </p>
      </div>
    )
  }

  // Login/Register Component
  const LoginRegisterForm = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [showPasswordReset, setShowPasswordReset] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (showPasswordReset) {
        handlePasswordReset(formData.email)
      } else if (isLogin) {
        handleLogin(formData.email, formData.password)
      } else {
        if (handleRegister(formData.name, formData.email, formData.phone, formData.password)) {
          setIsLogin(true)
          setFormData({ name: '', email: '', phone: '', password: '' })
        }
      }
    }

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{showPasswordReset ? 'Reset Password' : (isLogin ? 'Login' : 'Register')}</CardTitle>
          <CardDescription>
            {showPasswordReset ? 'Enter your email to receive reset instructions' : 
             (isLogin ? 'Welcome back to Adventure Park' : 'Create your Adventure Park account')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !showPasswordReset && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            {!isLogin && !showPasswordReset && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0821234567"
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow numeric input
                    const value = e.target.value.replace(/\D/g, '')
                    setFormData({...formData, phone: value})
                  }}
                  maxLength="10"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">10 digits starting with 0</p>
              </div>
            )}
            {!showPasswordReset && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {showPasswordReset ? 'Send Reset Link' : (isLogin ? 'Login' : 'Register')}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            {!showPasswordReset && (
              <>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setSuccess('')
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
                {isLogin && (
                  <div>
                    <button
                      onClick={() => {
                        setShowPasswordReset(true)
                        setError('')
                        setSuccess('')
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </>
            )}
            {showPasswordReset && (
              <button
                onClick={() => {
                  setShowPasswordReset(false)
                  setError('')
                  setSuccess('')
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const activeUsers = registeredUsers.filter(u => u.status === 'active').length
    const totalRevenue = tickets.reduce((sum, t) => sum + t.price, 0)
    const totalTickets = tickets.length

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R{totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tickets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalTickets}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              {registeredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    {user.status === 'active' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deactivateUser(user.id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Deactivate
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => reactivateUser(user.id)}
                      >
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-900">Adventure Park</h1>
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{user.membershipLevel}</Badge>
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button variant="outline" onClick={() => {
                  setUser(null)
                  setIsAdmin(false)
                  setError('')
                  setSuccess('')
                }}>Logout</Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!user ? (
          <LoginRegisterForm />
        ) : isAdmin ? (
          <AdminDashboard />
        ) : (
          <Tabs defaultValue="attractions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="tickets">Buy Tickets</TabsTrigger>
              <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
            </TabsList>

            {/* Attractions Tab */}
            <TabsContent value="attractions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Park Attractions</CardTitle>
                  <CardDescription>Discover amazing rides and experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attractions.map(attraction => (
                    <div key={attraction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{attraction.name}</h3>
                        <p className="text-sm text-gray-600">{attraction.type}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-orange-500" />
                            <span>{attraction.waitTime} min wait</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{attraction.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={attraction.waitTime < 20 ? 'default' : 'secondary'}>
                        {attraction.waitTime < 20 ? 'Low Wait' : 'Moderate Wait'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Buy Tickets Tab */}
            <TabsContent value="tickets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Tickets</CardTitle>
                  <CardDescription>Choose your ticket type and payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-4 md:grid-cols-3">
                    {ticketTypes.map(ticketType => (
                      <Card key={ticketType.id} className="border-2 hover:border-blue-500 transition-colors">
                        <CardHeader>
                          <CardTitle className="text-lg">{ticketType.name}</CardTitle>
                          <CardDescription>{ticketType.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold mb-4">R{ticketType.price}</p>
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              setError('')
                              purchaseTicket(ticketType.id, 'Credit Card')
                            }}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Purchase
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="my-tickets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Tickets</CardTitle>
                  <CardDescription>View and manage your purchased tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No tickets purchased yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map(ticket => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{ticket.type}</h3>
                              <p className="text-sm text-gray-600">Purchased: {ticket.purchaseDate}</p>
                              <p className="text-sm text-gray-600">Valid until: {ticket.validUntil}</p>
                              <p className="text-lg font-bold mt-2">R{ticket.price}</p>
                            </div>
                            <Badge variant={ticket.status === 'Active' ? 'default' : 'secondary'}>
                              {ticket.status}
                            </Badge>
                          </div>
                          {generateQRDisplay(ticket.qrCode)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default App

