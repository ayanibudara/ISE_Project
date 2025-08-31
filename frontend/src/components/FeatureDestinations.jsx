import React from "react";

export const DestinationsList = () => {
  const destinations = [
    {
      id: 1,
      name: "Sigiriya Rock Fortress",
      province: "Central Province",
      image:
        "https://images.unsplash.com/photo-1586042091284-bd35c8c1d917?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Ancient rock fortress with frescoes and stunning views",
    },
    {
      id: 2,
      name: "Galle Fort",
      province: "Southern Province",
      image:
        "https://images.unsplash.com/photo-1586872285745-b490f2b5b8e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Colonial-era fort with Dutch architecture and ocean views",
    },
    {
      id: 3,
      name: "Temple of the Sacred Tooth Relic",
      province: "Central Province",
      image:
        "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description:
        "Buddhist temple housing the relic of the tooth of Buddha",
    },
    {
      id: 4,
      name: "Mirissa Beach",
      province: "Southern Province",
      image:
        "https://images.unsplash.com/photo-1586861256632-52a3db1073ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description:
        "Pristine beach known for whale watching and surfing",
    },
  ];

  return (
    <div className="destinations-container">
      <h1>Popular Destinations in Sri Lanka</h1>
      <div className="destinations-grid">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <img
              src={destination.image}
              alt={destination.name}
              className="destination-image"
            />
            <div className="destination-info">
              <h2>{destination.name}</h2>
              <p className="province">{destination.province}</p>
              <p className="description">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsList;