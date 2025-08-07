import { useEffect, useState } from "react";
import { User, Edit3, Save, X, Target, Mail, TrendingUp, Briefcase, Sparkles, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';
import api from "../api/axios";

// Enhanced JobProgressChart with futuristic styling
const JobProgressChart = ({ data = [], dailyTarget, user }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-4 shadow-2xl">
          <p className="text-cyan-300 text-sm font-medium">{`Date: ${label}`}</p>
          <p className="text-white font-bold">{`Applications: ${payload[0].value}`}</p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mt-2"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-cyan-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700 group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            Application Analytics
          </h3>
          <div className="flex-1"></div>
          <div className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-sm font-medium border border-cyan-500/30">
            Live Data
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} onMouseMove={(e) => setHoveredPoint(e.activeTooltipIndex)}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {dailyTarget && (
                <ReferenceLine 
                  y={dailyTarget} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  opacity={0.8}
                />
              )}
              <Line
                type="monotone"
                dataKey="applications"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 8, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Real API integration - restored from your original code
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setIsLoading(true);
        // Make sure the API paths are absolute (start with "/") and match your router.
        const [profileRes, statsRes] = await Promise.all([
          api.get("/users/me"),      
          api.get("/daily-stats"),   
        ]);
        // This is where we fix the original 404 error.
        setUser(profileRes.data);
        setChartData(statsRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        // Check if the error is a 404 on the stats endpoint.
        if (err.response && err.request.responseURL.includes('daily-stats')) {
             setError("Could not load stats data. The endpoint might be incorrect.");
        } else {
             setError("Could not load profile data. Please try again later.");
        }
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'daily_target' ? parseInt(value, 10) : value;
    setUser({ ...user, [name]: processedValue });
  };

  const handleUpdateProfile = async () => {
    setError("");
    setIsLoading(true);
    try {
      // The payload only contains fields the backend can update.
      const payload = {
        full_name: user.full_name,
        daily_target: user.daily_target,
      };
      const res = await api.put("/users/me", payload); 
      setUser(res.data); 
      setIsEditing(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please check your inputs.");
      setIsLoading(false);
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300 text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-cyan-900 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">
            Career Command Center
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your AI-powered career acceleration hub. Future job matching powered by LinkedIn integration.
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/30 to-cyan-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-700 group">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-2">
                {user?.full_name || 'Loading...'}
              </h2>
              <p className="text-slate-400 mb-4">Career Optimization Specialist</p>
              
              {/* Stats Preview */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">Target: {user?.daily_target || 0}/day</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-300">Live Data</span>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25 group"
              >
                <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Enhance Profile
              </button>
            )}
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cyan-300 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={user.full_name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email (Secured)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 backdrop-blur-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cyan-300 font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Daily Application Target
                </label>
                <input
                  type="number"
                  name="daily_target"
                  value={user.daily_target}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className="w-full md:w-64 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-medium text-slate-300">Identity</h4>
                </div>
                <p className="text-white font-semibold text-lg">{user?.full_name || 'N/A'}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <h4 className="font-medium text-slate-300">Contact</h4>
                </div>
                <p className="text-white font-semibold">{user?.email || 'N/A'}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <h4 className="font-medium text-slate-300">Daily Goal</h4>
                </div>
                <p className="text-white font-semibold text-lg">{user?.daily_target || 0} applications</p>
              </div>
            </div>
          )}
        </div>

        {/* Future LinkedIn Integration Preview */}
        <div className="bg-gradient-to-br from-blue-900/30 via-slate-900/50 to-purple-900/30 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              AI-Powered Job Matching
            </h3>
            <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
              Coming Soon
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-300 mb-4">
                Our AI will analyze your profile and match you with the most relevant opportunities from LinkedIn's vast job database.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Smart profile analysis
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Personalized job recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Auto-application assistance
                </li>
              </ul>
            </div>
            <div className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">LinkedIn Integration</h4>
                <p className="text-slate-400 text-sm">Connect your LinkedIn profile to unlock AI-powered job matching</p>
                <button className="mt-4 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-lg font-medium border border-blue-500/30 cursor-not-allowed opacity-60">
                  Available in Next Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <JobProgressChart data={chartData} dailyTarget={user?.daily_target} user={user} />
      </div>
    </div>
  );
};

export default Profile;
