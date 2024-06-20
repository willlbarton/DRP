import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";
import { format, addHours, addMinutes, isAfter } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from '@/contexts/authContexts';


const HelpPage = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState(new Map<string, boolean>());
  const [date, setDate] = React.useState<Date>();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!date) return

    const slotsCollectionRef = collection(db, 'bookings', format(date, "yyyy-MM-dd"), 'slots');
    const unsubscribe = onSnapshot(slotsCollectionRef, (snapshot) => {
      const newAvailability = new Map<string, boolean>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        newAvailability.set(doc.id, data.status !== "booked");
        console.log("data: ", data)
        console.log("newAvailability: ", data.status !== "booked")
      });
      setAvailability(newAvailability);
    });

    return () => unsubscribe();
  }, [date]);

  const updateTime = (event: any) => {
    const t = event.target.getAttribute("data-time");
    setSelectedTime(t);
  };

  const isAvailable = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    var d = date ? date : new Date();
    d = addHours(d, hours)
    d = addMinutes(d, minutes)
    if (isAfter(d, new Date())) {
      if (!availability.has(time)) {
        return true;
      }
      return availability.get(time);
    }
    return false
  };

  const bookTime = async () => {
    if (isAvailable(selectedTime)) {
      try {
        const dat = format(date ? date : new Date(), "yyyy-MM-dd");
        console.log(dat)
        const docRef = doc(db, "bookings", dat, "slots", selectedTime);
        await setDoc(docRef, { status: "booked", user: currentUser?.uid }, { merge: true });
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
      <div className="flex flex-col gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
        {date &&
        <div className='flex flex-col items-center'>
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
        }
      </div>
    </div>
  );
};

export default HelpPage;

