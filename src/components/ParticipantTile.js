import React, { useEffect } from 'react';
import './ParticipantTile.css';

function ParticipantTile({ initials, name, bgColor, isUser, isHighlighted, isMuted, videoStream, videoRef }) {
    // Collega lo stream video all'elemento video
    useEffect(() => {
        if (videoRef && videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream, videoRef]);

    return (
        <div className={`participant-tile ${isHighlighted ? 'highlighted' : ''} ${isUser ? 'is-user' : ''}`}>
            <div className="tile-content" style={{ backgroundColor: bgColor }}>
                {videoStream ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="video-feed"
                    />
                ) : (
                    <div className="avatar">
                        <span className="initials">{initials}</span>
                    </div>
                )}
            </div>

            <div className="participant-info">
                <span className="participant-name">{name}</span>
                {isMuted && (
                    <span className="muted-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                        </svg>
                    </span>
                )}
            </div>

            {/* Bordo viola animato */}
            {isHighlighted && <div className="highlight-border"></div>}
        </div>
    );
}

export default ParticipantTile;
