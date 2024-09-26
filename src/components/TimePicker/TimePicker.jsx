import { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

const TimePickerComponent = ({ onChange }) => {
    const [dateTime, setDateTime] = useState(null);

    const handleDateTimeChange = newDateTime => {
        setDateTime(newDateTime);
        if (newDateTime) {
            const formattedTime = newDateTime.format('HH:mm'); // Formateamos la hora en formato de 12 horas
            onChange(formattedTime);  // Enviamos solo la hora formateada
        }
    };

    return (
        <div>
            <DatePicker
                value={dateTime}
                onChange={handleDateTimeChange}
                format='hh:mm A'  // Mostramos la hora en formato de 12 horas
                style={{ minWidth: "20rem", height: '38px' }}
                plugins={[
                    <TimePicker 
                        hideSeconds
                        mStep={60}
                        key="unique-key"
                        style={{ minWidth: "250px" }}
                        minTime="07:00 AM"
                        maxTime="09:00 PM"
                    />
                ]}
            />
        </div>
    );
};

export default TimePickerComponent;
