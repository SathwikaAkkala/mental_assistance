import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Users, 
  Award,
  Smile,
  Meh,
  Frown,
  Heart,
  Brain,
  Activity,
  Clock,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [weeklyStats, setWeeklyStats] = useState({
    averageMood: 0,
    sessionsCompleted: 0,
    streakDays: 0,
    totalMinutes: 0
  });

  useEffect(() => {
    if (!user?.id) return;

    // Load today's mood from localStorage
    const storedMood = localStorage.getItem(`mood_${user?.id}_${new Date().toDateString()}`);
    if (storedMood) {
      setTodayMood(storedMood);
    }

    // Initialize stats - always start fresh for demo purposes
    // In production, you'd want to load existing stats
    const initialStats = {
      averageMood: 0,
      sessionsCompleted: 0,
      streakDays: 0,
      totalMinutes: 0
    };
    
    // Check if user has any mood entries to calculate real stats
    const allMoodEntries = [];
    let dayCount = 0;
    let totalMoodValue = 0;
    let totalMinutes = 0;
    
    // Check last 30 days for mood entries
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const moodEntry = localStorage.getItem(`mood_${user.id}_${dateString}`);
      
      if (moodEntry) {
        dayCount++;
        const moodValue = moodEntry === 'happy' ? 8 : moodEntry === 'neutral' ? 5 : 2;
        totalMoodValue += moodValue;
        totalMinutes += Math.floor(Math.random() * 2) + 1; // 1-2 minutes per session
      }
    }
    
    if (dayCount > 0) {
      initialStats.sessionsCompleted = dayCount;
      initialStats.averageMood = Math.round((totalMoodValue / dayCount) * 10) / 10;
      initialStats.streakDays = dayCount; // Simplified streak calculation
      initialStats.totalMinutes = totalMinutes;
    }
    
    setWeeklyStats(initialStats);
    localStorage.setItem(`stats_${user.id}`, JSON.stringify(initialStats));
  }, [user?.id]);

  const quickMoodUpdate = (mood: string) => {
    if (!user?.id) return;
    
    const wasFirstMoodToday = !todayMood;
    setTodayMood(mood);
    localStorage.setItem(`mood_${user.id}_${new Date().toDateString()}`, mood);
    
    // Convert mood to number for average calculation
    const moodValue = mood === 'happy' ? 8 : mood === 'neutral' ? 5 : 2;
    
    // Only update stats if this is the first mood entry today
    if (wasFirstMoodToday) {
      const newSessionCount = weeklyStats.sessionsCompleted + 1;
      const newStreakDays = weeklyStats.streakDays + 1;
      const newTotalMinutes = weeklyStats.totalMinutes + Math.floor(Math.random() * 2) + 1; // Add 1-2 minutes
      
      // Calculate new average mood
      const newAverageMood = newSessionCount === 1 ? 
        moodValue : 
        ((weeklyStats.averageMood * weeklyStats.sessionsCompleted) + moodValue) / newSessionCount;
      
      const newStats = { 
        averageMood: Math.round(newAverageMood * 10) / 10, // Round to 1 decimal place
        sessionsCompleted: newSessionCount,
        streakDays: newStreakDays,
        totalMinutes: newTotalMinutes
      };
      
      setWeeklyStats(newStats);
      localStorage.setItem(`stats_${user.id}`, JSON.stringify(newStats));
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="h-8 w-8 text-green-500" />;
      case 'neutral': return <Meh className="h-8 w-8 text-yellow-500" />;
      case 'sad': return <Frown className="h-8 w-8 text-red-500" />;
      default: return <Heart className="h-8 w-8 text-gray-400" />;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = (minutes: number) => {
    if (minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatAverageMood = (mood: number) => {
    if (mood === 0) return '--';
    return `${mood.toFixed(1)}/10`;
  };

  const formatStreak = (days: number) => {
    if (days === 0) return '0 days';
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This will clear all mood entries and stats.')) {
      // Clear all mood entries and stats for this user
      Object.keys(localStorage).forEach(key => {
        if (key.includes(user?.id || '')) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset state
      setTodayMood(null);
      setWeeklyStats({
        averageMood: 0,
        sessionsCompleted: 0,
        streakDays: 0,
        totalMinutes: 0
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {getGreeting()}, {user?.name}!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {weeklyStats.sessionsCompleted === 0 
                  ? "Welcome to your wellness journey! Let's start by checking in on how you're feeling today."
                  : "How are you feeling today? Let's check in on your wellness journey."
                }
              </p>
            </div>
            
            {/* Reset Data Button (for demo purposes) */}
            <button
              onClick={clearAllData}
              className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Quick Mood Check */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Mood Check
          </h2>
          {todayMood ? (
            <div className="flex items-center space-x-4">
              {getMoodIcon(todayMood)}
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  Feeling {todayMood} today
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mood logged for {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                How are you feeling right now?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => quickMoodUpdate('happy')}
                  className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Smile className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm text-green-700 dark:text-green-300">Happy</span>
                </button>
                <button
                  onClick={() => quickMoodUpdate('neutral')}
                  className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <Meh className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">Neutral</span>
                </button>
                <button
                  onClick={() => quickMoodUpdate('sad')}
                  className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Frown className="h-8 w-8 text-red-500 mb-2" />
                  <span className="text-sm text-red-700 dark:text-red-300">Sad</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatAverageMood(weeklyStats.averageMood)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {weeklyStats.sessionsCompleted}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatStreak(weeklyStats.streakDays)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(weeklyStats.totalMinutes)}
                </p>
              </div>
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/chatbot"
            className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-purple-100">
              Start a conversation with your personal AI wellness companion
            </p>
          </Link>

          <Link
            to="/mood-tracker"
            className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mood Tracker</h3>
            <p className="text-green-100">
              Track your emotions and discover patterns in your wellness
            </p>
          </Link>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 group cursor-pointer"
               onClick={() => {
                 // Simulate community feature
                 alert('🌟 Welcome to the MindCare Community!\n\n👥 Connect with 10,000+ users\n💬 Share your wellness journey\n🤝 Support each other\n\n🚀 Feature launching soon with:\n• Group discussions\n• Wellness challenges\n• Peer support groups\n• Anonymous sharing');
               }}>
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-orange-100">
              Connect with others on their wellness journey
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-orange-100">10,000+ active members</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Your Wellness Journey
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Welcome to MindCare!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your mental wellness journey starts here. Explore our features to get started.
                </p>
              </div>
            </div>
            
            {todayMood && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  {getMoodIcon(todayMood)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Mood logged for today
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You're feeling {todayMood} today. Keep track of your emotions!
                  </p>
                </div>
              </div>
            )}

            {weeklyStats.sessionsCompleted > 1 && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Great progress!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've completed {weeklyStats.sessionsCompleted} wellness sessions. Keep it up!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;