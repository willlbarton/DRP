import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

const HelpPage = () => {
  const [selectedTime, setSelectedTime] = useState("");

  const updateTime = (event: any) => {
    const t = event.target.getAttribute("data-time");
    console.log("PRESSED!" + t);
    setSelectedTime(t);
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
              >
                {slot.display}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpPage;
