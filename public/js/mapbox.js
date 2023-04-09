export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWJkODk4IiwiYSI6ImNsZnY4cWlmYTA0cW4zaXM2a2lyYW44NDYifQ.bMwWCOOLLCVJ1_T7lG7noQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/abd898/clfv9tsi2007m01mz7srhiv6b',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      right: 50,
      left: 50,
    },
  });
};
