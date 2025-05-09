// src/pages/user/CabinSlots.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvailableSlots {
  cabin_name: string;
  available_slots: Record<string, string[]>;
}

const CabinSlots = () => {
  const { cabinId } = useParams<{ cabinId: string }>();
  const [slots, setSlots] = useState<AvailableSlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // ✅ Fetch Slots Function (Accessible Everywhere)
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

  const handleBookSlot = async () => {
    if (!selectedSlot) return;

    try {
      await api.post(`/bookings/${cabinId}/book-selected-slot`, {
        selected_slot: selectedSlot
      });
      toast.success("Slot booked successfully!");
      setConfirming(false);
      setSelectedSlot(null);
      fetchSlots(); // ✅ Reload slots after booking
    } catch (error) {
      toast.error("Failed to book the selected slot");
    }
  };

  const renderSlots = () => {
    if (!slots || Object.keys(slots.available_slots).length === 0) {
      return (
        <div className="text-center mt-6">
          <p className="text-gray-500 text-lg">No available slots for today or tomorrow.</p>
        </div>
      );
    }

    return Object.entries(slots.available_slots).map(([date, times]) => (
      <div key={date} className="mb-4">
        <h3 className="text-lg font-semibold">{date}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {times.length > 0 ? (
            times.map((time) => (
              <button
                key={time}
                className="nxtwave-btn"
                onClick={() => {
                  setSelectedSlot(time);
                  setConfirming(true);
                }}
              >
                {time}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No available slots</p>
          )}
        </div>
      </div>
    ));
  };

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Available Slots</h1>
          {slots ? <h2 className="text-xl">{slots.cabin_name}</h2> : null}
        </div>

        {loading ? (
          <p>Loading slots...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {renderSlots()}
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
            <p>Are you sure you want to book the slot at <strong>{selectedSlot}</strong>?</p>
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
