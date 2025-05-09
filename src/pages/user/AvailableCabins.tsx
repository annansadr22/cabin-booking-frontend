// src/pages/user/AvailableCabins.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import api from "@/lib/axios"; // Importing the configured Axios

interface Cabin {
  id: number;
  name: string;
  description: string;
  slot_duration: number;
}

const AvailableCabins = () => {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCabins = async () => {
      setLoading(true);
      try {
        const response = await api.get("/cabins/");
        setCabins(response.data);
      } catch (err) {
        setError("Failed to load cabins");
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, []);

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Available Cabins</h1>
          <p className="text-gray-600">
            Browse our selection of cabins and check availability for your next getaway
          </p>
        </div>

        {loading ? (
          <p>Loading cabins...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map((cabin) => (
              <div key={cabin.id} className="nxtwave-card group overflow-hidden flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{cabin.name}</h2>
                <p className="text-gray-600 mb-2 flex-grow">{cabin.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Slot Duration: {cabin.slot_duration} minutes
                  </span>
                  <Link 
                    to={`/user/cabins/${cabin.id}/slots`}
                    className="nxtwave-btn"
                  >
                    View Available Slots
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default AvailableCabins;
