import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TeamsCall.css';
import ParticipantTile from './ParticipantTile';

// Lista di iniziali fittizie per gli altri partecipanti
const OTHER_PARTICIPANTS = [
    { id: 1, initials: 'AB', name: 'Andrea Bianchi', bgColor: '#4a4a8a' },
    { id: 2, initials: 'LR', name: 'Laura Rossi', bgColor: '#6b4a8a' },
    { id: 3, initials: 'MV', name: 'Marco Verdi', bgColor: '#4a6b8a' },
    { id: 4, initials: 'GP', name: 'Giulia Palermo', bgColor: '#8a6b4a' },
    { id: 5, initials: 'FC', name: 'Francesco Costa', bgColor: '#4a8a6b' },
];

// Intervallo per il bordo viola (1 minuto = 60000 ms)
const HIGHLIGHT_INTERVAL = 60000; // 1 minuto

function TeamsCall({ userInitials, onLeave }) {
    const [highlightedId, setHighlightedId] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [videoStream, setVideoStream] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef(null);
    const callContainerRef = useRef(null);

    // Funzione per attivare/disattivare fullscreen
    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            try {
                if (callContainerRef.current.requestFullscreen) {
                    await callContainerRef.current.requestFullscreen();
                } else if (callContainerRef.current.webkitRequestFullscreen) {
                    await callContainerRef.current.webkitRequestFullscreen();
                } else if (callContainerRef.current.msRequestFullscreen) {
                    await callContainerRef.current.msRequestFullscreen();
                }
                setIsFullscreen(true);
            } catch (err) {
                console.error('Errore fullscreen:', err);
            }
        } else {
            try {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                }
                setIsFullscreen(false);
            } catch (err) {
                console.error('Errore uscita fullscreen:', err);
            }
        }
    };

    // Listener per rilevare quando si esce dal fullscreen con ESC
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Funzione per attivare/disattivare la webcam
    const toggleVideo = async () => {
        if (isVideoOff) {
            // Attiva la webcam
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });
                setVideoStream(stream);
                setIsVideoOff(false);
            } catch (err) {
                console.error('Errore accesso webcam:', err);
                alert('Impossibile accedere alla webcam. Verifica i permessi del browser.');
            }
        } else {
            // Disattiva la webcam
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
            }
            setIsVideoOff(true);
        }
    };

    // Cleanup dello stream quando si esce dalla chiamata
    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoStream]);

    // Timer per la durata della chiamata
    useEffect(() => {
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Funzione per evidenziare un partecipante random
    const highlightRandomParticipant = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * OTHER_PARTICIPANTS.length);
        const randomId = OTHER_PARTICIPANTS[randomIndex].id;
        setHighlightedId(randomId);

        // Rimuovi l'evidenziazione dopo 5 secondi
        setTimeout(() => {
            setHighlightedId(null);
        }, 5000);
    }, []);

    // Timer per evidenziare ogni 10 minuti
    useEffect(() => {
        const timer = setInterval(() => {
            highlightRandomParticipant();
        }, HIGHLIGHT_INTERVAL);

        return () => clearInterval(timer);
    }, [highlightRandomParticipant]);

    // Formatta la durata della chiamata
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="teams-call" ref={callContainerRef}>
            {/* Pulsante Fullscreen */}
            <button
                className="fullscreen-button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
            >
                {isFullscreen ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                )}
            </button>

            {/* Header */}
            <div className="call-header">
                {isSharing ? (
                    <div className="shared-screen">
                        <img src="/shareScreen.png" alt="Schermo condiviso" className="shared-screen-image" />
                    </div>
                ) : (
                    <div className="meeting-info">
                        <h2>Riunione del team</h2>
                        <span className="call-duration">{formatDuration(callDuration)}</span>
                    </div>
                )}
            </div>

            {/* Griglia partecipanti */}
            <div className="participants-grid">
                {/* Tile dell'utente */}
                <ParticipantTile
                    initials={userInitials}
                    name="Tu"
                    bgColor="#6264a7"
                    isUser={true}
                    isMuted={isMuted}
                    videoStream={videoStream}
                    videoRef={videoRef}
                />

                {/* Tiles degli altri partecipanti */}
                {OTHER_PARTICIPANTS.map(participant => (
                    <ParticipantTile
                        key={participant.id}
                        initials={participant.initials}
                        name={participant.name}
                        bgColor={participant.bgColor}
                        isHighlighted={highlightedId === participant.id}
                    />
                ))}
            </div>

            {/* Controlli chiamata */}
            <div className="call-controls">
                <button
                    className={`control-button ${isMuted ? 'active' : ''}`}
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Riattiva audio' : 'Disattiva audio'}
                >
                    {isMuted ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                        </svg>
                    )}
                </button>

                <button
                    className={`control-button ${isVideoOff ? 'active' : ''}`}
                    onClick={toggleVideo}
                    title={isVideoOff ? 'Attiva video' : 'Disattiva video'}
                >
                    {isVideoOff ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    )}
                </button>

                <button
                    className={`control-button share ${isSharing ? 'active-share' : ''}`}
                    onClick={() => setIsSharing(!isSharing)}
                    title={isSharing ? 'Interrompi condivisione' : 'Condividi schermo'}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                    </svg>
                </button>

                <button
                    className="control-button leave"
                    onClick={onLeave}
                    title="Abbandona la chiamata"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default TeamsCall;
