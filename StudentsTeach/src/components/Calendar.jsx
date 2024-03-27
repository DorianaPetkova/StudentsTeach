import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarProp = () => {
    const [date, setDate] = useState(new Date());
    const [eventText, setEventText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleEventSubmit = () => {
        console.log('Event:', eventText);
        setEvents([...events, { date: date.toDateString(), text: eventText }]);
        setEventText('');
        closeModal();
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const eventDates = events.map(event => event.date);
            if (eventDates.includes(date.toDateString())) {
                return <div className="red-dot"></div>;
            }
        }
        return null;
    };

    const eventForSelectedDate = events.find(event => event.date === date.toDateString());

    return (
        <div className='calendar'>
            <div className='calendar-container'>
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={tileContent}
                />
            </div>
            <p className='text-center'>
                <span className='bold'>Selected Date:</span>{' '}
                {date.toDateString()}
            </p>
            <p className='text-center'>
                {eventForSelectedDate && (
                    <>
                        <span className='bold'>Event:</span> {eventForSelectedDate.text}
                    </>
                )}
            </p>
            <button onClick={openModal}>Add Event</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <div className="modal-content">
                        <h2>Create an Event</h2>
                        <input
                            type="text"
                            value={eventText}
                            onChange={(e) => setEventText(e.target.value)}
                            placeholder="Enter event description"
                        />
                        <button onClick={handleEventSubmit}>Create</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarProp;
