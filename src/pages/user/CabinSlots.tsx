  // src/pages/user/CabinSlots.tsx
  import { useState, useEffect } from "react";
  import { useParams } from "react-router-dom";
  import { UserLayout } from "@/components/UserLayout";
  import api from "@/lib/axios";
  import { toast } from "sonner";
  import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

  interface AvailableSlots {
    cabin_name: string;
    available_slots: Record<string, string[]>;
    booked_slots_info: Record<string, { username: string; employee_id: string }>;
    restricted_slots: Record<string, [string, string][]>; 
    slot_duration: number; // ✅ ADD THIS

  }


  const CabinSlots = () => {
    const { cabinId } = useParams<{ cabinId: string }>();
    const [slots, setSlots] = useState<AvailableSlots | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ time: string; duration: number } | null>(null);
    const [confirming, setConfirming] = useState(false);

    // ✅ Fetch Slots Function
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/bookings/${cabinId}/available-slots`);
        setSlots(response.data);
      } catch (err) {
        setError("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (cabinId) fetchSlots();
    }, [cabinId]);

    // ✅ Calculate Current IST Time (Client-Side)
    const getCurrentISTTime = () => {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
      return new Date(now.getTime() + istOffset - now.getTimezoneOffset() * 60 * 1000);
    };

    const handleBookSlot = async () => {
      if (!selectedSlotInfo) return;


      const { time, duration } = selectedSlotInfo;

      try {
        await api.post(`/bookings/${cabinId}/book-selected-slot`, {
          selected_slot: time,
          duration: duration
        });

        toast.success("Slot booked successfully!");
        setConfirming(false);
        setSelectedSlotInfo(null);

        fetchSlots();
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Failed to book the selected slot");
      }
    };

const renderSlots = () => {
  if (!slots || Object.keys(slots.available_slots).length === 0) {
    return <p className="text-gray-500 text-lg">No available slots for today or tomorrow.</p>;
  }

  return Object.entries(slots.available_slots).map(([date, times]) => {
    const restrictedForDay = slots.restricted_slots?.[date] || [];

    return (
      <div key={date} className="mb-6">
        <h3 className="text-lg font-semibold">{date}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {times.map((time) => {
            const cleanTime = time.split(" (")[0];
            const durationMatch = time.match(/\((\d+)\s*min\)/);
            const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
            const isPast = time.includes("(Past)");
            const isBooked = !!slots.booked_slots_info?.[cleanTime];
            const bookedBy = isBooked ? slots.booked_slots_info[cleanTime] : null;

            const isDisabled = isPast || isBooked;

            return (
              <div key={time} className="flex flex-col items-center">
                <button
                  className={`nxtwave-btn transition duration-200 text-sm px-4 py-2 ${
                    isPast
                      ? "bg-gray-200 text-gray-600 border-gray-400 cursor-not-allowed"
                      : isBooked
                      ? "bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedSlotInfo({ time: cleanTime, duration });
                      setConfirming(true);
                    }
                  }}
                  disabled={isDisabled}
                  title={
                    isPast
                      ? "Past Slot"
                      : isBooked
                      ? `Booked by ${bookedBy?.username}`
                      : ""
                  }
                >
                  {time}
                </button>

                {isBooked && bookedBy && (
                  <p className="text-xs text-blue-600 mt-1">
                    👤 {bookedBy.username} ({bookedBy.employee_id})
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ Restricted Times (only for this date) */}
{restrictedForDay.length > 0 && (
  <div className="mt-4 mx-auto max-w-xl bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm">
    <h4 className="text-md font-semibold text-yellow-800 mb-2">
      ⚠️ Restricted Time Ranges for {date}
    </h4>
    <ul className="list-disc list-inside text-sm text-yellow-700">
      {restrictedForDay.map(([start, end], idx) => (
        <li key={idx}>
          {start.split(" ")[1]} to {end.split(" ")[1]}
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    );
  });
};






    return (
      <UserLayout>
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800">Available Slots</h1>
          {slots ? <h2 className="text-xl">{slots.cabin_name}</h2> : null}
          
          {loading ? <p>Loading slots...</p> : error ? <p className="text-red-500">{error}</p> : renderSlots()}

          {/* Confirmation Dialog */}
          <Dialog open={confirming} onOpenChange={setConfirming}>
            <DialogContent>
              <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
              <p>
                Are you sure you want to book the slot at <strong>{selectedSlotInfo?.time}</strong> for 
                <strong> {selectedSlotInfo?.duration} minutes</strong>?
              </p>

              <DialogFooter>
                <Button onClick={() => setConfirming(false)} variant="outline">Cancel</Button>
                <Button onClick={handleBookSlot} className="nxtwave-btn">Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </UserLayout>
    );
  };

  export default CabinSlots;
