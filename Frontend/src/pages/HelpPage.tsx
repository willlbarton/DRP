import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

const TimeSelector = () => {
  const [selectedTime, setSelectedTime] = useState("");
  var updateTime = (event: any) => {
    const t = event.target.getAttribute("data-time");
    console.log("PRESSED!" + t)
    setSelectedTime(t);
  }
  // assume 9am to 5pm, 15-minute intervals.
  const times = [9,10,11,12,13,14,15,16,17].map((hour) =>
    <div>
      <Button variant="ghost" className="ml-2" onClick={updateTime} data-time={hour+":00"}>
        {hour.toString()+":00"}
      </Button>
      <Button variant="ghost" className="ml-2" onClick={updateTime} data-time={hour+":15"}>
        {hour.toString()+":15"}
      </Button>
      <Button variant="ghost" className="ml-2" onClick={updateTime} data-time={hour+":30"}>
        {hour.toString()+":30"}
      </Button>
      <Button variant="ghost" className="ml-2" onClick={updateTime} data-time={hour+":45"}>
        {hour.toString()+":45"}
      </Button>
    </div> )
  return (
    <div>
      Selected time: {selectedTime}
      <br></br>
      {times}
    </div>
  )
}
const HelpPage = () => {

  return (
    <>
    <div>HelpPage</div>
    <div>
      <TimeSelector />
    </div>
    </>
  )
}


export default HelpPage