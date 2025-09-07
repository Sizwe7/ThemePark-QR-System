import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { 
  QrCode, Users, DollarSign, Clock, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Settings, LogOut, Activity, MapPin,
  CreditCard, Ticket, Bell, Shield
} from 'lucide-react'
import './App.css'

// Mock data for demonstration
const mockStaff = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@themepark.com',
  role: 'STAFF',
  id: 'staff_001'
}

const mockDashboardData = {
  realTime: {
    current_visitors: 342,
    active_queues: 8,
    average_queue_time: 16,
    system_load: 68.5,
    payment_success_rate: 99.2,
    api_response_time: 145,
    last_updated: new Date().toISOString()
  },
  summary: {
    total_visitors_today: 1250,
    total_revenue_today: 112500.00,
    average_satisfaction_today: 4.2,
    average_wait_time_today: 18.5,
    visitor_growth_percentage: 12.5,
    revenue_growth_percentage: 8.3
  },
  hourlyTrends: [
    { hour: 9, visitors: 45, revenue: 4050, wait_time: 5 },
    { hour: 10, visitors: 78, revenue: 7020, wait_time: 8 },
    { hour: 11, visitors: 125, revenue: 11250, wait_time: 12 },
    { hour: 12, visitors: 165, revenue: 14850, wait_time: 18 },
    { hour: 13, visitors: 180, revenue: 16200, wait_time: 22 },
    { hour: 14, visitors: 172, revenue: 15480, wait_time: 20 },
    { hour: 15, visitors: 158, revenue: 14220, wait_time: 16 },
    { hour: 16, visitors: 142, revenue: 12780, wait_time: 14 }
  ],
  attractions: [
    {
      id: '1',
      name: 'Thunder Mountain Coaster',
      status: 'OPEN',
      current_visitors: 18,
      current_wait_time: 15,
      capacity_utilization: 75,
      total_visitors_today: 245
    },
    {
      id: '2',
      name: 'Family Fun Carousel',
      status: 'OPEN',
      current_visitors: 25,
      current_wait_time: 5,
      capacity_utilization: 78,
      total_visitors_today: 312
    },
    {
      id: '3',
      name: 'Adventure Water Rapids',
      status: 'OPEN',
      current_visitors: 12,
      current_wait_time: 25,
      capacity_utilization: 75,
      total_visitors_today: 189
    },
    {
      id: '4',
      name: 'Space Mission Simulator',
      status: 'MAINTENANCE',
      current_visitors: 0,
      current_wait_time: 0,
      capacity_utilization: 0,
      total_visitors_today: 0
    }
  ],
  paymentTrends: [
    { method: 'Credit Card', transactions: 450, amount: 40500, percentage: 45 },
    { method: 'Mobile Wallet', transactions: 320, amount: 28800, percentage: 32 },
    { method: 'QR Payment', transactions: 180, amount: 16200, percentage: 18 },
    { method: 'Cash', transactions: 50, amount: 4500, percentage: 5 }
  ]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - in real app, this would call an API
    onLogin(mockStaff)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Staff Dashboard</CardTitle>
          <CardDescription>Theme Park QR System - Staff Access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Staff Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your staff email"
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
              Sign In to Dashboard
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

function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center mt-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {trendValue}
              </div>
            )}
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function AttractionStatusCard({ attraction }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-green-500'
      case 'MAINTENANCE': return 'bg-red-500'
      case 'CLOSED': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return CheckCircle
      case 'MAINTENANCE': return AlertTriangle
      case 'CLOSED': return XCircle
      default: return XCircle
    }
  }

  const StatusIcon = getStatusIcon(attraction.status)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{attraction.name}</h3>
          <div className="flex items-center">
            <StatusIcon className={`w-4 h-4 mr-1 ${attraction.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}`} />
            <Badge variant={attraction.status === 'OPEN' ? 'default' : 'destructive'}>
              {attraction.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Current Visitors</p>
            <p className="font-medium">{attraction.current_visitors}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Wait Time</p>
            <p className="font-medium">{attraction.current_wait_time} min</p>
          </div>
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-medium">{attraction.capacity_utilization}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Today's Total</p>
            <p className="font-medium">{attraction.total_visitors_today}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MainDashboard({ staff, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [data] = useState(mockDashboardData)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Theme Park QR - Staff Dashboard</h1>
            <p className="text-sm opacity-90">Welcome, {staff.name} ({staff.role})</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Activity className="w-4 h-4 mr-1" />
              Overview
            </TabsTrigger>
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
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Current Visitors"
                value={data.realTime.current_visitors}
                icon={Users}
                trend="up"
                trendValue="+12.5%"
              />
              <MetricCard
                title="Today's Revenue"
                value={`$${data.summary.total_revenue_today.toLocaleString()}`}
                icon={DollarSign}
                trend="up"
                trendValue="+8.3%"
              />
              <MetricCard
                title="Avg Wait Time"
                value={`${data.summary.average_wait_time_today} min`}
                icon={Clock}
                subtitle="Across all attractions"
              />
              <MetricCard
                title="System Health"
                value={`${data.realTime.system_load}%`}
                icon={Activity}
                subtitle="System load"
              />
            </div>

            {/* Hourly Trends Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Today's Visitor Trends</CardTitle>
                <CardDescription>Hourly visitor count and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.hourlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="visitors" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col">
                    <QrCode className="w-6 h-6 mb-2" />
                    Scan QR Code
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Ticket className="w-6 h-6 mb-2" />
                    Validate Ticket
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <AlertTriangle className="w-6 h-6 mb-2" />
                    Report Issue
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Manage Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attractions" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Attraction Status</h2>
              <p className="text-muted-foreground">Real-time status of all park attractions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.attractions.map(attraction => (
                <AttractionStatusCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Ticket Management</h2>
              <p className="text-muted-foreground">Validate and manage visitor tickets</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">QR Code Scanner</h3>
                  <p className="text-muted-foreground mb-4">Scan visitor tickets to validate entry</p>
                  <Button>
                    <QrCode className="w-4 h-4 mr-2" />
                    Start Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Payment Analytics</h2>
              <p className="text-muted-foreground">Payment method distribution and trends</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.paymentTrends}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ method, percentage }) => `${method} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="transactions"
                      >
                        {data.paymentTrends.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.paymentTrends.map((payment, index) => (
                      <div key={payment.method} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium">{payment.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{payment.transactions} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Advanced Analytics</h2>
              <p className="text-muted-foreground">Detailed insights and reporting</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <BarChart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">Detailed reports and insights coming soon</p>
                  <Button variant="outline">
                    Generate Report
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
  const [staff, setStaff] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedStaff = localStorage.getItem('themepark_staff')
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (staffData) => {
    setStaff(staffData)
    localStorage.setItem('themepark_staff', JSON.stringify(staffData))
  }

  const handleLogout = () => {
    setStaff(null)
    localStorage.removeItem('themepark_staff')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        {staff ? (
          <MainDashboard staff={staff} onLogout={handleLogout} />
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
    </Router>
  )
}

export default App
