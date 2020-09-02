// Here we define the theme menu
let colorPicker = document.querySelector("ul#themes-list");
let themes = document.querySelectorAll("ul#themes-list li");
let themeBtn = document.querySelector("button#change-theme");

// Here we define the themes, it is an array of objects
let styles = [
  {
    name: "dark",
    background: "#002b36",
    backgroundHighlight: "#073642",
    primaryText:  "#839496",
    secondaryText: "#586e75",
    emphasizedText: "#93a1a1",
    highlight: "#b58900"
  },
  {
    name: "light",
    background: "#fdf6e3",
    backgroundHighlight: "#eee8d5",
    primaryText:  "#657b83",
    secondaryText: "#93a1a1",
    emphasizedText: "#586e75",
    highlight: "#cb4b16"
  }
];

// select theme
themes.forEach( theme => {
  theme.addEventListener("click", (e) => {
    setTheme(e.target.textContent.toLowerCase());
    colorPicker.classList.toggle("hidden");
  });
});

// show the menu
themeBtn.addEventListener("click", () => {
  colorPicker.classList.toggle("hidden")

  // the position is set right under the button
  colorPicker.style.left = themeBtn.offsetLeft + "px";
  colorPicker.style.top = themeBtn.offsetTop + themeBtn.offsetHeight + "px";
});

// this function actually changes the style of the website
function setTheme(name) {
  let themeExists = false;
  // search in the styles array
  styles.forEach( style => {
    // if the style is found, the site gets changed and the theme exists
    if (style.name === name) {
      document.documentElement.style.setProperty("--background", style.background);
      document.documentElement.style.setProperty("--background-highlight", style.backgroundHighlight);
      document.documentElement.style.setProperty("--primary-text", style.primaryText);
      document.documentElement.style.setProperty("--secondary-text", style.secondaryText);
      document.documentElement.style.setProperty("--emphasized-text", style.emphasizedText);
      document.documentElement.style.setProperty("--highlight", style.highlight);

      // save the preferred theme for the future
      localStorage.setItem("preferredTheme", name);

      themeExists = true;
    }
  });

  // if the theme does not exist
  if (!themeExists) {
    console.log(name + " is not a defined theme. Please add it.");
  }
}

/* In this section the search function is defined. */
let search = document.querySelector("input#search");
let searchArray = [];

// on input in the search bar, the input gets saved and is available for processing.
// then the entries get filtered
search.addEventListener("change", () => {
  // get the search term and remove junk
  let searchTerm = search.value.toLowerCase().trim();
  searchTerm = searchTerm.replaceAll(/[^A-Za-z\s]*/g, "");
  searchTerm = searchTerm.replaceAll(/\s{2,}/g, " ");
  // create a new array of tags
  searchArray = searchTerm.split(" ");

  // remove focus from searchbar
  search.blur();
  // empty search bar
  search.value = "";

  // filter based on searchArray
  filterEntries();
});

// filter the blog entries according to searchArray: The blog entry tags get compared to the searchArray and if no match is found, it will get hidden from the website, unless the searchArray is empty, then every entry will be displayed.
function filterEntries() {
  let entries;
  let searchTags;

  // no search tags --> user wants all entries
  if (searchArray.length <= 1 && (searchArray[0] === null || searchArray[0] === "")) {
    // query for all hidden entries
    entries = document.querySelectorAll("article[class~='hidden']");
    // go through every hidden entry
    for (const entry in entries) {
      // remove the hidden attribute
      entry.classList.remove("hidden");
    }
    // end method here
    return;
  }

  // create one string with all tags
  searchTags = searchArray.toString();
  // get all entries
  entries = document.querySelectorAll("article");
  // go through every entry
  for (let i = 0; i < entries.length; i++) {
    let tagMatch = false;
    // get the list of tag items for this entry
    let tagItems = entries[i].lastElementChild.children
    // go through every tag item
    for (let j = 0; j < tagItems.length; j++) {
      // the tag is in the list of searchTags, at the start, at the end or is the only item
      if (searchTags.includes(`,${tagItems[j].textContent.toLowerCase()},`)
        || searchTags.startsWith(tagItems[j].textContent.toLowerCase() + ",")
        || searchTags.endsWith("," + tagItems[j].textContent.toLowerCase())
        || searchTags === tagItems[j].textContent.toLowerCase()) {
        // at least on tag matches no need to search further
        tagMatch = true;
        break;
      }
    }

    // if the entry does not match the search
    if (!tagMatch) {
      // hide it
      entries[i].classList.add("hidden");
    } else {
      // if it was previously hidden, the class gets removed
      entries[i].classList.remove("hidden");
    }
  }
}

// Here the preferred options get loaded, when the website loads
window.onload = () => {
  // load the name of the preferred theme
  const preferredTheme = localStorage.getItem("preferredTheme");
  // if a preferred theme exists, it gets set
  if (preferredTheme != null) {
    setTheme(preferredTheme);
  }
}
