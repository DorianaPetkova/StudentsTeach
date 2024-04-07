import React, { useState, useContext, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../context/AuthC';
import {
    arrayUnion, setDoc, doc, updateDoc, serverTimestamp, getDoc,
} from "firebase/firestore";
import { ChatContext } from "../context/ChatC";

const CalendarProp = () => {
    const [date, setDate] = useState(new Date());
    const [eventText, setEventText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let chatId;
                if (data.server.id) {
                    chatId = data.server.id;
                } else {
                    chatId = currentUser.uid > data.user.uid ? `${currentUser.uid}_${data.user.uid}` : `${data.user.uid}_${currentUser.uid}`;
                }
                const eventRef = doc(db, `calendars/${chatId}`);
                const docSnapshot = await getDoc(eventRef);
                if (docSnapshot.exists()) {
                    setEvents(docSnapshot.data().events);
                    setLoading(false); // Set loading to false when events are fetched
                } else {
                    setEvents([]); // Clear events state when no events exist
                    setLoading(false); // Set loading to false
                }
            } catch (error) {
                console.error('Error fetching events from Firestore:', error);
                setEvents([]); // Clear events state on error
                setLoading(false); // Set loading to false on error
            }
        };
        fetchEvents();
    }, [currentUser.uid, data.user.uid, data.server.id]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEventSubmit = async () => {
        console.log('Event:', eventText);
        const event = {
            text: eventText,
            date: date.toDateString(),
        };

        try {
            let chatId;
            if (data.server.id) {
                chatId = data.server.id;
            } else {
                chatId = currentUser.uid > data.user.uid ? `${currentUser.uid}_${data.user.uid}` : `${data.user.uid}_${currentUser.uid}`;
            }
            const eventRef = doc(db, `calendars/${chatId}`);
            const docSnapshot = await getDoc(eventRef);
            if (docSnapshot.exists()) {
                await updateDoc(eventRef, {
                    events: arrayUnion(event),
                });
            } else {
                await setDoc(eventRef, {
                    events: [event],
                });
            }
            console.log('Event added to Firestore:', event);

            // Update the local state to include the newly added event
            setEvents(prevEvents => [...prevEvents, event]);
        } catch (error) {
            console.error('Error adding event to Firestore:', error);
        }

        setEventText('');
        closeModal();
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const eventDates = events.map(event => new Date(event.date));
            const currentDate = new Date(date);
            if (eventDates.some(eventDate => eventDate.toDateString() === currentDate.toDateString())) {
                return <div className="red-dot"></div>;
            }
        }
        return null;
    };

    const eventForSelectedDate = events.find(event => event.date === date.toDateString());

    return (
        <div className='calendar'>
            <div className='calendar-container'>
                {loading ? ( // Show loading indicator while events are being fetched
                    <p>Loading...</p>
                ) : (
                    <Calendar
                        onChange={setDate}
                        value={date}
                        tileContent={tileContent}
                    />
                )}
            </div>
            <p className='text-center'>
                <span className='bold'>Selected Date:</span>{' '}
                {date.toDateString()}

                <p className='text-center'>
                {eventForSelectedDate && (
                    <>
                        <span className='bold'>Event:</span> {eventForSelectedDate.text}
                    </>
                )}
              </p>
                <button onClick={openModal} className='btn-calendar-add'>Add Event</button>
              </p>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className="modal-content">
                        <h2>Create an Event</h2>
                        <input
                            type="text" className='form-control'
                            value={eventText}
                            onChange={(e) => setEventText(e.target.value)}
                            placeholder="Enter event description"
                        />
                        <button onClick={handleEventSubmit} className='btn-calendar-add'>Create</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarProp;
