form.addEventListener('submit', async event => {
    event.preventDefault();
    
    const radius = form.elements.radius.value;

    const response = await fetch(`/api/spots?radius=${radius}`);
    const spots = await response.json();

    spotList.innerHTML = '';
    for (const spot of spots) {
      const li = document.createElement('li');
      li.textContent = `Latitude: ${spot.latitude}, Longitude: ${spot.longitude}`;
      spotList.appendChild(li);
    }
  });
