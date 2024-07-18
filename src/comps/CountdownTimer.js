import React, { useState, useEffect } from "react";
import { AddLeadingZero } from "../helpers/func";

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    const difference = lastDayOfMonth - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {timeLeft.days !== undefined ? (
        <div>
          <span>{timeLeft.days}J(天)</span>
          <span className=" text-xl font-bold  ">
            {AddLeadingZero(timeLeft.hours)}H{AddLeadingZero(timeLeft.minutes)}'
            {AddLeadingZero(timeLeft.seconds)}''
          </span>
        </div>
      ) : (
        <span>Time's up!</span>
      )}
    </div>
  );
};

export default CountdownTimer;
