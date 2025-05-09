
// Types
export interface Cabin {
  id: string;
  name: string;
  description: string;
  slotDuration: number; // in hours
  image: string;
}

export interface Slot {
  id: string;
  cabinId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  cabinId: string;
  slotId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "active" | "completed" | "cancelled";
  userName?: string; // Used only for admin view
  cabinName?: string; // Used only for admin view
}

// Mock data
export const mockCabins: Cabin[] = [
  {
    id: "1",
    name: "Lakeside Retreat",
    description: "Peaceful cabin overlooking the serene lake, perfect for relaxation and nature lovers.",
    slotDuration: 2,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Forest Haven",
    description: "Cozy cabin surrounded by pine trees, offering tranquility and connection with nature.",
    slotDuration: 3,
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3"
  },
  {
    id: "3",
    name: "Mountain View",
    description: "Elegant cabin with panoramic views of the mountain range, ideal for outdoor enthusiasts.",
    slotDuration: 2,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3"
  },
  {
    id: "4",
    name: "River Cabin",
    description: "Rustic cabin beside the flowing river, perfect for fishing and water activities.",
    slotDuration: 4,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3"
  }
];

// Generate slots for the next 7 days
const generateSlots = () => {
  const slots: Slot[] = [];
  const today = new Date();
  
  mockCabins.forEach(cabin => {
    // Create slots for each of the next 7 days
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      
      // Create slots based on cabin's slot duration
      const slotDuration = cabin.slotDuration;
      const startHour = 9; // 9 AM
      const endHour = 21; // 9 PM
      
      for (let hour = startHour; hour < endHour; hour += slotDuration) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(currentDate);
        endTime.setHours(hour + slotDuration, 0, 0, 0);
        
        slots.push({
          id: `${cabin.id}-${startTime.toISOString()}`,
          cabinId: cabin.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          // Randomly determine if a slot is already booked (30% chance)
          isBooked: Math.random() < 0.3
        });
      }
    }
  });
  
  return slots;
};

export const mockSlots: Slot[] = generateSlots();

// Generate some mock bookings
export const generateBookings = (userId: string): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();
  
  // Create some active bookings
  for (let i = 0; i < 3; i++) {
    const bookedSlot = mockSlots.find(slot => slot.isBooked);
    if (bookedSlot) {
      const cabin = mockCabins.find(c => c.id === bookedSlot.cabinId);
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i + 1);
      
      bookings.push({
        id: `booking-${i + 1}`,
        userId,
        cabinId: bookedSlot.cabinId,
        slotId: bookedSlot.id,
        bookingDate: today.toISOString(),
        startTime: bookedSlot.startTime,
        endTime: bookedSlot.endTime,
        status: "active",
        userName: "User",
        cabinName: cabin?.name
      });
    }
  }
  
  // Create some past bookings
  for (let i = 0; i < 2; i++) {
    const bookedSlot = mockSlots.find(slot => slot.isBooked);
    if (bookedSlot) {
      const cabin = mockCabins.find(c => c.id === bookedSlot.cabinId);
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i - 1);
      
      bookings.push({
        id: `booking-past-${i + 1}`,
        userId,
        cabinId: bookedSlot.cabinId,
        slotId: bookedSlot.id,
        bookingDate: today.toISOString(),
        startTime: new Date(pastDate).toISOString(),
        endTime: new Date(pastDate).toISOString(),
        status: "completed",
        userName: "User",
        cabinName: cabin?.name
      });
    }
  }
  
  return bookings;
};

export const mockBookings: Booking[] = generateBookings("1");
