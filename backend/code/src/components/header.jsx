import React, { useState, useEffect } from 'react';

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [ws, setWs] = useState(null);

  // WebSocket connection setup
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:5000/canvas');
    
    websocket.onopen = () => {
      setConnectionStatus('connected');
      addNotification('Connected to collaboration server');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      addNotification(message.content);
    };

    websocket.onclose = () => {
      setConnectionStatus('disconnected');
      addNotification('Disconnected from server');
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [...prev.slice(-4), newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white border-b border-gray-700">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">CodeCollab</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <span className={`text-sm ${
            connectionStatus === 'connected' ? 'text-green-400' :
            connectionStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {connectionStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            Canvas Connection
          </button>
        </div>

        <div className="relative group">
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 relative">
            Notifications
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-700">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm">No new notifications</p>
            ) : (
              notifications.map(({ id, message, timestamp }) => (
                <div 
                  key={id}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  <p className="text-sm">- {message}</p>
                  <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;