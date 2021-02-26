"use strict";


// This is the global list of the stories, an instance of StoryList
let storyList;
let $favoriteStar = $(".fa-star");

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <small class="favoriteStar"><i class="star far fa-star"></i></small>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
    
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//click event listener for favorite button (star) to fire toggleFavorite
$body.on('click', '.star', (evt) => {
  toggleFavorite(evt)
  // toggleStarIcon(evt)
});

//toggle favorte star to show if favorite also add to user favorites
function toggleFavorite(evt) {
  console.debug("toggleFunction()");

  //see what the parent of the click event is
  console.log($(evt.target).parent().parent());
  let liElement = $(evt.target).parent().parent();
  let storyId = liElement[0].id;
  
  // cycle through user favs 
  for (let el of currentUser.favorites) {
    // id matches set to false and remove
    if(el.storyId === storyId) {
      el.favorite = false;      
      currentUser.removeFavorite(storyId)
    }
    else {
      el.favorite = true;
      currentUser.addFavorite(storyId);
    }
  }
}

// function toggleStarIcon(evt) {
//   console.log($(evt.target).class())
// }

// event to append story to page
$("#addStoryButton").on("click",  async (e)=>{
  console.debug("click event triggered")
  
  e.preventDefault();
  
  // update global stories list
  await submitStory();
  putStoriesOnPage();

  //hide the form
  $(".add-story-info").hide();
});


// create Story instance that is added to global stories list 
async function submitStory() {
  console.debug("submitStory");

  // store current user input to a variable
  let storyObj = {title: $storyAddTitle.val(), author: $storyAddAuthor.val(), url: $storyAddURL.val()};
  
  // create an instance to return to stories list.
  let Story = await storyList.addStory(currentUser, storyObj);
  
  // add that Story instance to the stories list
  storyList.stories.unshift(Story);
}

function updateFavorites() {
  currentUser.favorites.forEach( e => { 
    e.favorite = true; 
  })
}