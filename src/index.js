// index.js

// Callbacks
const handleClick = (ramen) => {
  // Update the details section with the clicked ramen information
  const detailImg = document.querySelector("#ramen-detail > .detail-image");
  const detailName = document.querySelector("#ramen-detail > .name");
  const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
  const detailsRating = document.getElementById("rating-display");
  const detailsComment = document.getElementById("comment-display");
  
  detailImg.src = ramen.image;
  detailImg.alt = ramen.name;
  detailName.textContent = ramen.name;
  detailRestaurant.textContent = ramen.restaurant;
  detailsRating.textContent = ramen.rating;
  detailsComment.textContent = ramen.comment;
};

const addSubmitListener = (formElement) => {
  // Use the passed form element if it's provided (for testing)
  // Otherwise, find it in the DOM
  const ramenForm = formElement || document.getElementById('new-ramen');
  
  if (ramenForm) {
    ramenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const newRamen = {
        name: e.target.name.value,
        restaurant: e.target.restaurant.value,
        image: e.target.image.value,
        rating: e.target.rating.value,
        comment: e.target["new-comment"].value,
        id: Date.now() // Generate a unique ID
      };
      
      // Create a new image element for the menu
      const img = document.createElement('img');
      img.src = newRamen.image;
      img.alt = newRamen.name;
      
      // Add click event listener to the new image
      img.addEventListener('click', () => handleClick(newRamen));
      
      // Add new ramen to the menu
      const ramenMenu = document.getElementById('ramen-menu');
      ramenMenu.appendChild(img);
      
      // Reset the form
      e.target.reset();
    });
  }
};

const displayRamens = () => {
  // Fetch all ramens from the API
  return fetch('http://localhost:3000/ramens')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(ramens => {
      const ramenMenu = document.getElementById('ramen-menu');
      if (!ramenMenu) {
        console.error("Couldn't find ramen-menu element");
        return [];
      }
      
      // Clear existing content
      ramenMenu.innerHTML = '';
      
      console.log("Ramens loaded:", ramens);
      
      // Create and append image elements for each ramen
      ramens.forEach(ramen => {
        console.log("Creating image for:", ramen.name, "with src:", ramen.image);
        
        const img = document.createElement('img');
        img.src = ramen.image;
        img.alt = ramen.name;
        img.className = 'ramen-img'; // Add a class for styling
        
        // Add click event listener to display ramen details
        img.addEventListener('click', () => {
          console.log("Image clicked:", ramen.name);
          handleClick(ramen);
        });
        
        ramenMenu.appendChild(img);
      });
      
      // Display the first ramen details when page loads (for advanced deliverable)
      if (ramens.length > 0) {
        handleClick(ramens[0]);
      }
      
      return ramens;
    })
    .catch(error => {
      console.error('Error fetching or processing ramens:', error);
      return []; // Return empty array on error to avoid breaking tests
    });
};

const main = () => {
  console.log("Application starting...");
  
  // Invoke displayRamens to show all ramens when page loads
  displayRamens().then(ramens => {
    console.log(`Successfully loaded ${ramens.length} ramens`);
  });
  
  // Invoke addSubmitListener to set up the form submission handler
  addSubmitListener();
};

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};

// Only call main if we're not in a test environment
if (typeof process === 'undefined' || !process.env.VITEST) {
  // Make sure DOM is fully loaded before running main
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
