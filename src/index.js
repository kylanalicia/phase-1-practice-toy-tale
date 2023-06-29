// Initialize a variable to keep track of whether the toy is being added or not
let addToy = false;
// Get the HTML element with id "toy-collection"
let divToyCollection = document.querySelector("#toy-collection");

// Function to fetch toys from the server
function getToys() {
  return fetch("http://localhost:3000/toys")
    .then(response => response.json());
}

// Function to post a new toy to the server
function postToy(toy_data) {
  // Send a POST request to the server with the toy data
  fetch("http://localhost:3000/toys", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toy_data.name.value,
      "image": toy_data.image.value,
      "likes": 0
    })
  })
    .then(response => response.json())
    .then((object_toy) => {
      // Call the `renderToys` function with the newly added toy object
      let new_toy = renderToys(object_toy);
      // Append the newly created toy element to the toy collection div
      divToyCollection.append(new_toy);
    });
}

// Function to handle when the like button is clicked
function likes(event) {
  // Prevent the default action of the event (e.g. form submission, link click)
  event.preventDefault();
  // Get the current number of likes and increment by 1
  let moreLikes = parseInt(event.target.previousElementSibling.innerText) + 1;

  // Send a PATCH request to update the number of likes for the toy with the specified id
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "likes": moreLikes
    })
  })
    .then(response => response.json())
    .then((moreLikesObject) => {
      // Update the displayed number of likes with the updated value
      event.target.previousElementSibling.innerText = `${moreLikes} likes`;
    });
}

// Function to render a toy onto the webpage
function renderToys(toy) {
  // Create an h2 element to display the name of the toy
  let h2 = document.createElement("h2");
  h2.innerText = toy.name;

  // Create an image element to display the image of the toy
  let image = document.createElement("img");
  image.setAttribute("src", toy.image);
  image.setAttribute("class", "toy-avatar");

  // Create a p element to display the number of likes for the toy
  let p = document.createElement("p");
  p.innerText = `${toy.likes} likes`;

  // Create a button element to allow users to like the toy
  let likeButton = document.createElement('button');
  likeButton.setAttribute("class", "like-btn");
  likeButton.setAttribute("id", toy.id);
  likeButton.innerHTML = "like!";
  
  // Add an event listener to the like button for a click event
  likeButton.addEventListener("click", (event) => {
    // Log the dataset of the target element to the console
    console.log(event.target.dataset);
    // Call the likes function, passing in the event
    likes(event);
  });

  // Create a div element to contain the card for the toy
  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  
  // Append the h2, image, p, and likeButton elements to the divCard element
  divCard.appendChild(h2, image, p, likeButton);
  
  // Append the divCard element to the divToyCollection element on the webpage
  divToyCollection.appendChild(divCard);
}

// Event listener for when the DOM content has been loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the addBtn element and toyFormContainer element from the webpage
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  // Add an event listener to the addBtn for a click event
  addBtn.addEventListener("click", () => {
    // Toggle the visibility of the toyFormContainer by changing its display style property
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      
      // Add an event listener to the toyFormContainer form for a submit event
      toyFormContainer.addEventListener("submit", event => {
        // Prevent the default form submission behavior
        event.preventDefault();
        
        // Call the postToy function, passing in the target of the event (the form)
        postToy(event.target);
      });
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Call the getToys function and handle the returned toys
getToys().then(toys => {
  // For each toy, call the renderToys function
  toys.forEach(toy => {
    renderToys(toy);
  });
});
