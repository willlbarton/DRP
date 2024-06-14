import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const HelpPage = () => {
  const server = "http://localhost:5000";
  const connectionSettings = {
   "force new connection": true,
   reconnectionAttempts: Infinity,
   timeout: 10000,
   transports: ["websocket"],
  };
  const [selectedTime, setSelectedTime] = useState("");
  const [getAvailability, setAvailability] = useState(new Map([["9:00",true]])); // map from e.g. "9:00" to boolean.
  const socket = io(server, connectionSettings); // server connection
  useEffect(() => {
    // Event listener for successful connection
    socket.on("connect", () => {
     console.log("Connected to socket.io server!");
    });

    socket.on("testing",(x : string) => {
      console.log("Received: " + x);
    });
    // Update button availability on new info from server.
    socket.on("servedAvailability", (serialData) => {
      console.log("Served availability... " + serialData);
      const entries = JSON.parse(serialData); // an array of [key, value] pairs.
      const newAvailability : Map<string, boolean> = new Map(entries) as Map<string, boolean>;
      console.log("Deserialized: " + newAvailability);
      setAvailability(newAvailability);
      console.log("Availabilities updated on client.");
     });
     // connecting automatically requests availability.
     // cleanup socket once connection ends.
     return () => {
      socket.disconnect();
    };
  }, []);

  const updateTime = (event: any) => {
    const t = event.target.getAttribute("data-time");
    console.log("PRESSED! " + t);
    setSelectedTime(t);
  }
  const isAvailable = (time : string) => {
    if (!(getAvailability.has(time))) {
      return true;
    }
    return getAvailability.get(time);
  }

  const bookTime = (e: any) => {
    console.log("Booking pressed!");
    if (getAvailability.has(selectedTime) && isAvailable(selectedTime)) {
      socket.emit("book", selectedTime);
      console.log("Booking sent to server after clientside checks.");
    }
  }

  // assume 9am to 5pm, 15-minute intervals.
  const times = [9,10,11,12,13,14,15,16,17].flatMap((hour) => [
    { time: `${hour}:00`, display: `${hour}:00` },
    { time: `${hour}:15`, display: `${hour}:15` },
    { time: `${hour}:30`, display: `${hour}:30` },
    { time: `${hour}:45`, display: `${hour}:45` }
  ]);
  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold mb-4">Selected time: {selectedTime}</p>
          <div className="grid grid-cols-4 gap-4">
            {times.map((slot, index) => (
              <Button 
                key={index}
                variant="ghost"
                onClick={updateTime}
                data-time={slot.time}
                className="p-2 border border-none text-center w-full"
                style={{color: isAvailable(slot.time) ? "green" : "red"}}
              >
                {slot.display}
              </Button>
            ))}
          </div>
          <Button key="submit"
            variant = "ghost"
            onClick = {bookTime}>Book!</Button>
        </div>
      </div>
    </>
  );
}

export default HelpPage;
