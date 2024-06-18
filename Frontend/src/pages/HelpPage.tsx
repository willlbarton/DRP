import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

const HelpPage = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState(new Map<string, boolean>());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const newAvailability = new Map<string, boolean>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        newAvailability.set(doc.id, data.status !== "booked");
      });
      setAvailability(newAvailability);
    });

    return () => unsubscribe();
  }, []);

  const updateTime = (event: any) => {
    const t = event.target.getAttribute("data-time");
    setSelectedTime(t);
  };

  const isAvailable = (time: string) => {
    if (!availability.has(time)) {
      return true;
    }
    return availability.get(time);
  };

  const bookTime = async () => {
    if (availability.has(selectedTime) && isAvailable(selectedTime)) {
      try {
        const docRef = doc(db, 'bookings', selectedTime);
        await setDoc(docRef, { status: "booked" });
        setAvailability(prevAvailability => {
          const newAvailability = new Map(prevAvailability);
          newAvailability.set(selectedTime, false);
          return newAvailability;
        });
        setSelectedTime("");
      } catch (error) {
        console.error("Error booking time slot:", error);
      }
    }
  };

  const times = [9, 10, 11, 12, 13, 14, 15, 16, 17].flatMap((hour) => [
    { time: `${hour}:00`, display: `${hour}:00` },
    { time: `${hour}:15`, display: `${hour}:15` },
    { time: `${hour}:30`, display: `${hour}:30` },
    { time: `${hour}:45`, display: `${hour}:45` }
  ]);

  return (
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
              style={{ color: isAvailable(slot.time) ? "green" : "red" }}
              disabled={!isAvailable(slot.time)}
            >
              {slot.display}
            </Button>
          ))}
        </div>
        <Button key="submit" variant="ghost" onClick={bookTime}>
          Book!
        </Button>
      </div>
    </div>
  );
};

export default HelpPage;

