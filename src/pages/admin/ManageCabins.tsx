import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Cabin {
  id: number;
  name: string;
  description: string;
  slot_duration: number;
  start_time: string;
  end_time: string;
}

interface CabinFormData {
  id?: number;
  name: string;
  description: string;
  slot_duration: number;
}

const ManageCabins = () => {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCabin, setEditingCabin] = useState<CabinFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFormData: CabinFormData = {
    name: "",
    description: "",
    slot_duration: 30 // Default to 30 minutes
  };
  
  const [formData, setFormData] = useState<CabinFormData>(defaultFormData);

  // ✅ Fetch Cabins from Backend
  useEffect(() => {
    fetchCabins();
  }, []);

  const fetchCabins = async () => {
    try {
      const response = await api.get("/cabins");
      setCabins(response.data);
    } catch (error) {
      toast.error("Failed to load cabins");
    }
  };

  // ✅ Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "slot_duration" ? parseInt(value) : value
    }));
  };

  // ✅ Handle Create or Update Cabin
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        start_time: "09:00", // Default start time (9:00 AM)
        end_time: "19:00",   // Default end time (7:00 PM)
        max_bookings_per_day: 5 // Default to 5, change this as needed
      };

      if (editingCabin) {
        // Update Existing Cabin
        await api.put(`/cabins/${editingCabin.id}`, requestData);
        toast.success("Cabin updated successfully");
      } else {
        // Create New Cabin
        await api.post("/cabins", requestData);
        toast.success("Cabin created successfully");
      }

      fetchCabins();
      setFormData(defaultFormData);
      setEditingCabin(null);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save cabin");
    } finally {
      setIsSubmitting(false);
    }
  };


  // ✅ Handle Edit
  const handleEdit = (cabin: Cabin) => {
    setEditingCabin(cabin);
    setFormData({
      name: cabin.name,
      description: cabin.description,
      slot_duration: cabin.slot_duration
    });
    setShowForm(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (cabinId: number) => {
    if (window.confirm("Are you sure you want to delete this cabin?")) {
      try {
        await api.delete(`/cabins/${cabinId}`);
        toast.success("Cabin deleted successfully");
        fetchCabins();
      } catch (error) {
        toast.error("Failed to delete cabin");
      }
    }
  };

  // ✅ Handle Cancel Form
  const handleCancel = () => {
    setFormData(defaultFormData);
    setEditingCabin(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Cabins</h1>
          <button className="nxtwave-btn" onClick={() => setShowForm(true)}>
            Create New Cabin
          </button>
        </div>
        
        {/* Form for Create/Edit Cabin */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCabin ? "Edit Cabin" : "Create New Cabin"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Cabin Name"
                className="form-input mb-3"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Cabin Description"
                className="form-input mb-3"
                rows={3}
                required
              />
              <select
                name="slot_duration"
                value={formData.slot_duration}
                onChange={handleChange}
                className="form-input mb-3"
                required
              >
                {[30, 45, 60, 90, 120, 180, 240, 300, 360].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-3">
                <button type="button" className="px-4 py-2 bg-gray-200" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="nxtwave-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingCabin ? "Update Cabin" : "Create Cabin"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cabin List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cabins.map((cabin) => (
            <div key={cabin.id} className="nxtwave-card">
              <h2>{cabin.name}</h2>
              <p>{cabin.description}</p>
              <p>Duration: {cabin.slot_duration} minutes</p>
              <p>Time: {cabin.start_time} - {cabin.end_time}</p>
              <div className="flex justify-between mt-4">
                <button onClick={() => handleEdit(cabin)} className="bg-blue-500 text-white px-4 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(cabin.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCabins;
