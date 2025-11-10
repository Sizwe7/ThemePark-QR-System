import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { QrCode, Ticket, CreditCard, MapPin, Clock, Users, Star, Camera, Smartphone } from 'lucide-react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrCode, setQrCode] = useState('')

  // Sample attractions data
  const attractions = [
    { id: 1, name: 'Thunder Mountain', waitTime: 25, rating: 4.8, type: 'Roller Coaster' },
    { id: 2, name: 'Splash Rapids', waitTime: 15, rating: 4.6, type: 'Water Ride' },
    { id: 3, name: 'Space Adventure', waitTime: 35, rating: 4.9, type: 'Dark Ride' },
    { id: 4, name: 'Carousel Dreams', waitTime: 5, rating: 4.3, type: 'Family Ride' },
    { id: 5, name: 'Wild Safari', waitTime: 20, rating: 4.7, type: 'Adventure' }
  ]

  // Sample ticket types
  const ticketTypes = [
    { id: 1, name: 'Single Day Pass', price: 59.99, description: 'Access to all attractions for one day' },
    { id: 2, name: 'Premium Pass', price: 89.99, description: 'Skip-the-line access + all attractions' },
    { id: 3, name: 'Family Pack (4)', price: 199.99, description: '4 single day passes at discounted rate' }
  ]

  // Login function
  const handleLogin = (email, password) => {
    // Simulate login
    setUser({ 
      id: 1, 
      name: 'John Doe', 
      email: email,
      membershipLevel: 'Gold'
    })
  }

  // Purchase ticket function
  const purchaseTicket = (ticketType, paymentMethod) => {
    const newTicket = {
      id: Date.now(),
      type: ticketType.name,
      price: ticketType.price,
      purchaseDate: new Date().toLocaleDateString(),
      qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Active',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()
    }
    setTickets([...tickets, newTicket])
    setSelectedTicket(newTicket)
    setQrCode(newTicket.qrCode)
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
                <Button variant="outline" onClick={() => setUser(null)}>Logout</Button>
              </div>
            ) : (
              <Button onClick={() => handleLogin('demo@adventurepark.com', 'password')}>
                Login Demo
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!user ? (
          // Login Screen
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Adventure Park</CardTitle>
                <CardDescription>Login to access your tickets and park features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleLogin('demo@adventurepark.com', 'password')}
                >
                  Login
                </Button>
                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Don't have an account? Sign up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main App Content
          <Tabs defaultValue="attractions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="tickets">My Tickets</TabsTrigger>
              <TabsTrigger value="purchase">Buy Tickets</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            {/* Attractions Tab */}
            <TabsContent value="attractions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attractions.map((attraction) => (
                  <Card key={attraction.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{attraction.name}</CardTitle>
                        <Badge variant={attraction.waitTime > 30 ? "destructive" : attraction.waitTime > 15 ? "secondary" : "default"}>
                          {attraction.waitTime} min
                        </Badge>
                      </div>
                      <CardDescription>{attraction.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{attraction.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Wait: {attraction.waitTime}m</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="tickets" className="space-y-4">
              {tickets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Ticket className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Purchase tickets to start your adventure!
                    </p>
                    <Button onClick={() => document.querySelector('[value="purchase"]').click()}>
                      Buy Tickets
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedTicket(ticket)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{ticket.type}</CardTitle>
                          <Badge variant={ticket.status === 'Active' ? 'default' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          Purchased: {ticket.purchaseDate} | Valid until: {ticket.validUntil}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">${ticket.price}</span>
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            Show QR
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Purchase Tickets Tab */}
            <TabsContent value="purchase" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ticketTypes.map((ticketType) => (
                  <Card key={ticketType.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-xl">{ticketType.name}</CardTitle>
                      <CardDescription>{ticketType.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-4">
                        ${ticketType.price}
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => purchaseTicket(ticketType, 'Credit Card')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Purchase Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>We accept all major payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Badge variant="outline">Credit Card</Badge>
                    <Badge variant="outline">PayPal</Badge>
                    <Badge variant="outline">Apple Pay</Badge>
                    <Badge variant="outline">Google Pay</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-4">
              {selectedTicket ? (
                <div className="max-w-md mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Your Entry Ticket</CardTitle>
                      <CardDescription className="text-center">
                        {selectedTicket.type} - Valid until {selectedTicket.validUntil}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      {generateQRDisplay(selectedTicket.qrCode)}
                    </CardContent>
                  </Card>
                  
                  <div className="mt-4 text-center space-y-2">
                    <Button variant="outline" className="mr-2">
                      <Camera className="w-4 h-4 mr-2" />
                      Save to Photos
                    </Button>
                    <Button variant="outline">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Add to Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <QrCode className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No ticket selected</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Select a ticket from "My Tickets" to view QR code
                    </p>
                    <Button onClick={() => document.querySelector('[value="tickets"]').click()}>
                      View My Tickets
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Adventure Park</h3>
              <p className="text-gray-600 text-sm">
                The ultimate theme park experience with cutting-edge QR technology
                for seamless entry and payments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Park Hours</a></li>
                <li><a href="#" className="hover:text-gray-900">Attractions</a></li>
                <li><a href="#" className="hover:text-gray-900">Dining</a></li>
                <li><a href="#" className="hover:text-gray-900">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Lost & Found</a></li>
                <li><a href="#" className="hover:text-gray-900">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 Adventure Park. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

