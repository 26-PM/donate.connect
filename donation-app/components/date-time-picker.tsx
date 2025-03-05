"use client"

import { useState } from "react"
import styles from "@/styles/date-time-picker.module.css"

interface DateTimePickerProps {
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
}

export default function DateTimePicker({ selectedDate, onDateChange }: DateTimePickerProps) {
  const [isASAP, setIsASAP] = useState(false)

  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  // Generate time slots from 8 AM to 8 PM
  const generateTimeSlots = () => {
    const slots = []

    for (let hour = 8; hour <= 20; hour++) {
      const time = hour < 12 ? `${hour}:00 AM` : hour === 12 ? `${hour}:00 PM` : `${hour - 12}:00 PM`

      slots.push(time)
    }

    return slots
  }

  const handleDateSelect = (date: Date) => {
    setIsASAP(false)

    const selectedTime = selectedDate ? new Date(selectedDate).getHours() : 12 // Default to noon

    const newDate = new Date(date)
    newDate.setHours(selectedTime)

    onDateChange(newDate)
  }

  const handleTimeSelect = (timeString: string) => {
    if (!selectedDate) return

    const [hourStr, minuteStr] = timeString.split(":")
    let hour = Number.parseInt(hourStr)
    const isPM = timeString.includes("PM")

    if (isPM && hour !== 12) hour += 12
    if (!isPM && hour === 12) hour = 0

    const newDate = new Date(selectedDate)
    newDate.setHours(hour)
    newDate.setMinutes(0)

    onDateChange(newDate)
  }

  const handleASAP = () => {
    setIsASAP(true)

    // Set to current time + 2 hours
    const asapDate = new Date()
    asapDate.setHours(asapDate.getHours() + 2)

    onDateChange(asapDate)
  }

  const dates = generateDates()
  const timeSlots = generateTimeSlots()

  return (
    <div className={styles.dateTimePicker}>
      <div className={styles.asapOption}>
        <button type="button" className={`${styles.asapButton} ${isASAP ? styles.selected : ""}`} onClick={handleASAP}>
          Request ASAP Pickup (within 2 hours)
        </button>
      </div>

      <div className={styles.dateSelector}>
        <h3>Select a Date</h3>
        <div className={styles.datesContainer}>
          {dates.map((date, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dateButton} ${
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                !isASAP
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleDateSelect(date)}
              disabled={isASAP}
            >
              <span className={styles.dayName}>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span className={styles.dayNumber}>{date.getDate()}</span>
              <span className={styles.monthName}>{date.toLocaleDateString("en-US", { month: "short" })}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timeSelector}>
        <h3>Select a Time</h3>
        <div className={styles.timeSlotsContainer}>
          {timeSlots.map((time, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.timeButton} ${
                selectedDate &&
                time.includes(
                  selectedDate.getHours() < 12
                    ? selectedDate.getHours() === 0
                      ? "12:00 AM"
                      : `${selectedDate.getHours()}:00 AM`
                    : selectedDate.getHours() === 12
                      ? "12:00 PM"
                      : `${selectedDate.getHours() - 12}:00 PM`,
                ) &&
                !isASAP
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleTimeSelect(time)}
              disabled={isASAP}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className={styles.selectedDateTime}>
          <p>
            {isASAP
              ? "ASAP Pickup (within 2 hours)"
              : `Selected: ${selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })} at ${selectedDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}`}
          </p>
        </div>
      )}
    </div>
  )
}

