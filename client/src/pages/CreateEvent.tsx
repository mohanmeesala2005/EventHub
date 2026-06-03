import React, { useState } from 'react';
import Button from '../components/Button';

const CreateEvent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      // implement create submission
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <Button onClick={handleCreate} disabled={loading}>Create</Button>
    </div>
  );
};

export default CreateEvent;
