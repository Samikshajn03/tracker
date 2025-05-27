import { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import DestinationModal from '../Components/DestinationModal';
import DestinationCard from '../Components/DestinationCard';
import { fetchDestination } from '../utils/apiFunctions/DashboardCardDetailsFetch';
import '../styles/Dashboard.scss';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDestinations = async () => {
    const storedUserId = sessionStorage.getItem('id');

    if (!storedUserId) {
      console.warn('No userId found in sessionStorage');
      setLoading(false);
      return;
    }

    try {
      const result = await fetchDestination({ userId: storedUserId });
      //console.log('Fetched destinations:', result);
      setDestinations(result.data || []);
    } catch (error) {
      console.error('Error loading destinations:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleAddDestination = () => {
    setShowModal(false);
    loadDestinations();
  };

  const handleDelete = (indexToDelete) => {
    const updatedDestinations = destinations.filter((_, index) => index !== indexToDelete);
    setDestinations(updatedDestinations);
  };

  return (
    <div className="dashboard-container">
      <NavBar />
      <div className="dashboard-content">
        <div className="horizontal-bar">
          <h1 className="dashboard-title">Add Destinations</h1>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search Destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Destination
        </button>

        {showModal && (
          <DestinationModal
            onClose={handleAddDestination}
          />
        )}

        <div className="destination-grid">
          {loading ? (
            <p>Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <p>No destinations found.</p>
          ) : (
            destinations
              .filter((dest) =>
                `${dest.city} ${dest.country}`.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((dest) => (
                <DestinationCard
                   key={dest.id} dest={dest} onDelete={handleDelete}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
