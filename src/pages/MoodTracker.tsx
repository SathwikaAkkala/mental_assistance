import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Smile, 
  Meh, 
  Frown,
  Heart,
  Activity,
  Plus,
  Save
} from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  note: string;
  emotions: string[];
}

const MoodTracker: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);

  const emotions = [
    { name: 'Happy', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { name: 'Sad', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Anxious', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { name: 'Calm', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { name: 'Excited', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { name: 'Tired', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20' },
    { name: 'Stressed', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { name: 'Grateful', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  ];

  useEffect(() => {
    // Load mood entries from localStorage
    const storedEntries = localStorage.getItem(`mood_entries_${user?.id}`);
    if (storedEntries) {
      setMoodEntries(JSON.parse(storedEntries));
    }
  }, [user?.id]);

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      date: selectedDate,
      mood: currentMood,
      note: moodNote,
      emotions: selectedEmotions,
    };

    const updatedEntries = [...moodEntries.filter(entry => entry.date !== selectedDate), newEntry];
    setMoodEntries(updatedEntries);
    localStorage.setItem(`mood_entries_${user?.id}`, JSON.stringify(updatedEntries));
    
    // Reset form
    setMoodNote('');
    setSelectedEmotions([]);
    setShowAddEntry(false);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Smile className="h-6 w-6 text-green-500" />;
    if (mood >= 4) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-500';
    if (mood >= 6) return 'bg-yellow-500';
    if (mood >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  const getRecentEntries = () => {
    return moodEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  const getMoodTip = (mood: number) => {
    if (mood >= 8) {
      return "You're feeling great! This is wonderful. Consider what's contributing to this positive mood and try to maintain these habits.";
    } else if (mood >= 6) {
      return "You're doing well! Consider adding some activities that bring you joy to boost your mood even more.";
    } else if (mood >= 4) {
      return "It's okay to have neutral days. Try some gentle self-care activities like taking a walk or listening to music.";
    } else {
      return "I notice you're having a tough time. Remember that it's okay to feel this way. Consider reaching out to someone you trust or trying some relaxation techniques.";
    }
  };

  const todayEntry = moodEntries.find(entry => entry.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-purple-700 dark:text-purple-300 font-medium">
              Mood Tracking & Analytics
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Emotional Journey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your daily moods and discover patterns in your emotional well-being
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getAverageMood()}/10
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Entries Logged</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {moodEntries.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {moodEntries.length > 0 ? Math.min(moodEntries.length, 7) : 0} days
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Entry Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Mood Check
              </h2>
              {todayEntry && !showAddEntry ? (
                <button
                  onClick={() => setShowAddEntry(true)}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Edit
                </button>
              ) : null}
            </div>

            {todayEntry && !showAddEntry ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {getMoodIcon(todayEntry.mood)}
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Mood: {todayEntry.mood}/10
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(todayEntry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {todayEntry.emotions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emotions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {todayEntry.emotions.map(emotion => {
                        const emotionData = emotions.find(e => e.name === emotion);
                        return (
                          <span
                            key={emotion}
                            className={`px-3 py-1 text-sm rounded-full ${emotionData?.bg} ${emotionData?.color}`}
                          >
                            {emotion}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {todayEntry.note && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {todayEntry.note}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 {getMoodTip(todayEntry.mood)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How are you feeling today? (1-10)
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentMood}
                      onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">10</span>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center space-x-3">
                      {getMoodIcon(currentMood)}
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {currentMood}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What emotions are you experiencing?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotions.map(emotion => (
                      <button
                        key={emotion.name}
                        onClick={() => toggleEmotion(emotion.name)}
                        className={`p-3 text-sm rounded-lg border-2 transition-all ${
                          selectedEmotions.includes(emotion.name)
                            ? `${emotion.bg} border-current ${emotion.color}`
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {emotion.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Any notes about your day? (Optional)
                  </label>
                  <textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What happened today? How are you feeling? Any thoughts you'd like to capture..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <button
                  onClick={saveMoodEntry}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Save className="h-5 w-5" />
                  <span>Save Mood Entry</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Entries */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Entries
            </h2>
            
            {getRecentEntries().length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No mood entries yet. Start tracking your emotions!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getRecentEntries().map((entry, index) => (
                  <div
                    key={entry.date}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="flex-shrink-0">
                      {getMoodIcon(entry.mood)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.mood}/10
                        </span>
                      </div>
                      {entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.emotions.slice(0, 3).map(emotion => {
                            const emotionData = emotions.find(e => e.name === emotion);
                            return (
                              <span
                                key={emotion}
                                className={`px-2 py-1 text-xs rounded-full ${emotionData?.bg} ${emotionData?.color}`}
                              >
                                {emotion}
                              </span>
                            );
                          })}
                          {entry.emotions.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                              +{entry.emotions.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`w-3 h-8 rounded-full ${getMoodColor(entry.mood)}`}></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;