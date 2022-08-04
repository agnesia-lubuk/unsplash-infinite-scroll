const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

let ready = false
let imagesLoaded = 0
let totalImages = 0
let photosArray = []

let isInitialLoad = true

// Unsplash API
let initialCount = 5
const apiKey = 'fKofMI3b79c1lnPvNPE39EXyvXljQrWtr4Nol3y1_SE'
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    ready = true
    loader.hidden = true
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}
// Create Elements for links and photos, add to DOM
function displayPhotos() {
  totalImages = photosArray.length
  //   Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    })
    // Create <img> for photo
    const img = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    })
    // Event listener, check when each is finished loading
    img.addEventListener('load', imageLoaded)
    // Put <img> inside <a>, then put both inside imageContainer element
    item.appendChild(img)
    imageContainer.appendChild(item)
  })
}

// Get photos from Unsplash API
async function getUnsplashPhotos() {
  try {
    const response = await fetch(apiUrl)
    photosArray = await response.json()
    displayPhotos()
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30)
      isInitialLoad = false
    }
    ready = true
  } catch (error) {
    // Catch the error here
    console.log(error)
  }
}

// Check to see if scrolling near the bottom of, Load more photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false
    getUnsplashPhotos()
  }
})
// On Load
getUnsplashPhotos()
