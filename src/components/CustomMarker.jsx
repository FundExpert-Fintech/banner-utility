import React from 'react';

const CustomMarker = ({ itemNumber }) => {
  return (
    <p className="custom-marker text-center bg-yellow-400 rounded text-black p-2">
      Marker {itemNumber}
    </p>
  );
};

export default CustomMarker;