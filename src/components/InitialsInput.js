import React, { useState } from 'react';
import './InitialsInput.css';

function InitialsInput({ onJoin }) {
    const [initials, setInitials] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initials.trim().length >= 1 && initials.trim().length <= 3) {
            onJoin(initials.trim());
        }
    };

    return (
        <div className="initials-input-container">
            <div className="teams-logo">
                <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" width="80" height="80" />
            </div>
            <h1>Fake Teams Call</h1>
            <p className="subtitle">Inserisci le tue iniziali per partecipare alla riunione</p>

            <form onSubmit={handleSubmit} className="initials-form">
                <input
                    type="text"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.slice(0, 3))}
                    placeholder="Es: MR"
                    className="initials-field"
                    maxLength={3}
                    autoFocus
                />
                <button
                    type="submit"
                    className="join-button"
                    disabled={initials.trim().length < 1}
                >
                    Partecipa alla riunione
                </button>
            </form>
        </div>
    );
}

export default InitialsInput;
