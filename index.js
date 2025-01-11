import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_NabEGs4pVZcSYNR1VA4zejo8v93fn1tLUWg948UpGnxjDTGoTTZFXqnbvJKzV87x";

let breedArray = []; //array to hold different breeds

//interceptor for request sent
axios.interceptors.request.use((request) => {
  progressBar.style.width = "0%";
  document.querySelector("body").style.cursor = "progress";
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
  console.log("Request Begin :");
  return request;
});

//interceptor for response received
axios.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date().getTime();
    response.config.metadata.durationInMS =
      response.config.metadata.endTime - response.config.metadata.startTime;

    console.log(
      `Request took ${response.config.metadata.durationInMS} milliseconds.`
    );
    document.querySelector("body").style.cursor = "auto";
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.config.metadata.durationInMS =
      error.config.metadata.endTime - error.config.metadata.startTime;

    console.log(
      `Request took ${error.config.metadata.durationInMS} milliseconds.`
    );
    throw error;
  }
);

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    //get method to bring breeds info
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": "API_KEY",
      },
      onDownloadProgress: (progressEvent) => {
        updateProgress(progressEvent);
      },
    });
    //storing breed info into an array and assinging it to options element
    breedArray = response.data;
    for (let i = 0; i < breedArray.length; i++) {
      const option = document.createElement("option");
      breedSelect.appendChild(option);
      option.value = breedArray[i].id;
      option.textContent = breedArray[i].name;
    }
  } catch (error) {
    console.log(`Error from Inital Load func: ${error}`);
  }
  //calling retrieve function so it can load the first breed into the carousel
  retrieveBreed();
}
initialLoad(); //calling initialLoad so it can load the breeds into dropdown
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

//event listener to know what the user has selected from dropdown
breedSelect.addEventListener("change", retrieveBreed);

//Retrieve information and images on the selected breed from the cat API using fetch().
async function retrieveBreed() {
  Carousel.clear(); //clears the existing images and info
  infoDump.innerHTML = ""; //clears previous HTML elements from infoDump
  try {
    const selectedBreed = breedSelect.value; //get the user selected breed and assign it to selectedBreed

    // this section is to fetch 10 images of the selected breed
    let breedImageURL =
      "https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=" +
      selectedBreed;
    Carousel.clear();
    const responseImage = await axios.get(breedImageURL, {
      headers: {
        "x-api-key": API_KEY,
      },
      onDownloadProgress: (progressEvent) => {
        updateProgress(progressEvent);
      },
    });

    //creating elements and loading info about the breed into infoDump
    const dataImage = responseImage.data;
    const name = document.createElement("h3");
    name.textContent = "Name : " + dataImage[0].breeds[0].name;
    const desc = document.createElement("p");
    desc.textContent = "Description : " + dataImage[0].breeds[0].description;
    const temp = document.createElement("p");
    temp.textContent = "Temperament : + " + dataImage[0].breeds[0].temperament;
    const origin = document.createElement("p");
    origin.textContent = "Origin : " + dataImage[0].breeds[0].origin;

    infoDump.appendChild(name);
    infoDump.appendChild(desc);
    infoDump.appendChild(temp);
    infoDump.appendChild(origin);

    for (let i = 0; i < 10; i++) {
      const url = dataImage[i].url;
      const imageID = dataImage[i].id;
      const imgAlt = "Image of " + dataImage[i].breeds[0].name;

      //pushing images into carousel
      const imageItem = Carousel.createCarouselItem(url, imgAlt, imageID);
      Carousel.appendCarousel(imageItem);
    }
    Carousel.start();
  } catch (error) {
    console.log(`Error from Retrieve Breed func: ${error}`);
  }
}

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

//function to show progress bar
function updateProgress(progressEvent) {
  var percentCompleted = Math.round(
    (progressEvent.loaded / progressEvent.total) * 100 //calculating percentage loaded
  );
  progressBar.style.width = percentCompleted + "%";
}

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    //when favourite button is clicked check if the image has already been favourited
    const checkFav = await axios.get(
      `https://api.thecatapi.com/v1/favourites?image_id=${imgId}`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    //if the image is already favourited, delete it, if not add it to favourites
    if (checkFav.data[0]) {
      deleteImage(checkFav.data[0].id);
    } else {
      const newFavourite = await axios.post(
        "https://api.thecatapi.com/v1/favourites",
        {
          image_id: imgId,
        },
        { headers: { "x-api-key": API_KEY } }
      );
    }
  } catch (error) {
    console.log(`Error from favourite function: ${error}`);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

//event listener for Get favourites button
getFavouritesBtn.addEventListener("click", getFavourites);

//function to retrieve favourited images
async function getFavourites() {
  console.log("Get Favorite");

  infoDump.innerHTML = "";
  Carousel.clear();

  const responseImage = await axios.get(
    "https://api.thecatapi.com/v1/favourites",
    {
      headers: {
        "x-api-key": API_KEY,
      },
      onDownloadProgress: (progressEvent) => {
        updateProgress(progressEvent);
      },
    }
  );

  const dataImage = responseImage.data;

  for (let i = 0; i < dataImage.length; i++) {
    const url = dataImage[i].image.url;
    const imageID = dataImage[i].image_id;
    const imgAlt = "Image of favourited cats";

    const imageItem = Carousel.createCarouselItem(url, imgAlt, imageID);
    Carousel.appendCarousel(imageItem);
  }
  Carousel.start();
  const favInfo = document.createElement("h2");
  favInfo.textContent = "Images of favourited cats";
  infoDump.appendChild(favInfo);
}

async function deleteImage(favID) {
  try {
    const deleteImageRes = await axios.delete(
      "https://api.thecatapi.com/v1/favourites/" + favID,
      { headers: { "x-api-key": API_KEY } }
    );
  } catch (error) {
    console.log(`Error delete function: ${error}`);
  }
}

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
