import request from './request';

class TimeTracker {
  constructor() {
    this.startTime = null;
    this.accumulatedTime = 0;
    this.isTracking = false;
    this.syncInterval = null;
  }

  async getWeeklyProgress() {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/weeklyTimeProgress`,
        'GET'
      );
      
      console.log('Weekly progress response:', response);
      return response;
    } catch (error) {
      console.error('Failed to get weekly progress:', error);
      return null;
    }
  }

  startTracking() {
    if (this.isTracking) return;
    
    console.log('Starting time tracking');
    this.startTime = Date.now();
    this.isTracking = true;
    
    // Sync every 5 minutes
    this.syncInterval = setInterval(() => {
      this.syncWithServer();
    }, 5 * 60 * 1000);
  }

  stopTracking() {
    if (!this.isTracking) return;
    
    console.log('Stopping time tracking');
    this.syncWithServer(); // Final sync
    this.isTracking = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncWithServer() {
    if (!this.startTime) return;
    
    const currentTime = Date.now();
    const timeSpent = (currentTime - this.startTime) / 1000 / 60; // Convert to minutes
    const minutesSpent = Math.round(timeSpent);
    
    console.log('Syncing time:', minutesSpent, 'minutes');
    
    if (minutesSpent > 0) {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/account/trackTime`,
          'POST',
          {
            minutesSpent,
            date: new Date().toISOString()
          }
        );
        
        console.log('Time tracking response:', response);
        this.startTime = currentTime; // Reset start time after successful sync
      } catch (error) {
        console.error('Failed to sync time:', error);
      }
    }
  }
}

const timeTracker = new TimeTracker();
export default timeTracker;