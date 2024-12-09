async function calculateDistance() {
    const restaurantAddress = document.getElementById('restaurantAddress').value;
    const userAddress = document.getElementById('userAddress').value;
    const apiKey = 'b56c24f70bb64fd7a8c936955fa0c64f'; // Replace with your actual API key
  
    if (!restaurantAddress || !userAddress) {
      document.getElementById('result').innerText = 'Please enter both addresses.';
      return;
    }
  
    try {
      const [restaurantCoords, userCoords] = await Promise.all([
        getCoordinates(restaurantAddress, apiKey),
        getCoordinates(userAddress, apiKey)
      ]);
  
      if (restaurantCoords && userCoords) {
        const distance = haversineDistance(restaurantCoords, userCoords);
        document.getElementById('result').innerText = `Distance: ${distance.toFixed(2)} km`;
      } else {
        document.getElementById('result').innerText = 'Could not retrieve coordinates. Please check the addresses.';
      }
    } catch (error) {
      document.getElementById('result').innerText = 'An error occurred. Please try again.';
    }
  }
  
  async function getCoordinates(address, apiKey) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return [lat, lng];
    }
    return null;
  }
  
  function haversineDistance([lat1, lon1], [lat2, lon2]) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  