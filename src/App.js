import React, { useState } from 'react';
import './App.css';
import TeamsCall from './components/TeamsCall';
import InitialsInput from './components/InitialsInput';

function App() {
    const [userInitials, setUserInitials] = useState('');
    const [isInCall, setIsInCall] = useState(false);

    const handleJoinCall = (initials) => {
        setUserInitials(initials.toUpperCase());
        setIsInCall(true);
    };

    const handleLeaveCall = () => {
        setIsInCall(false);
        setUserInitials('');
    };

    return (
        <div className="app">
            {!isInCall ? (
                <InitialsInput onJoin={handleJoinCall} />
            ) : (
                <TeamsCall userInitials={userInitials} onLeave={handleLeaveCall} />
            )}
        </div>
    );
}

export default App;
