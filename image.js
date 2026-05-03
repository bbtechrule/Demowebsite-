const allMedia = [
  {
    type: "video",
    url: "https://res.cloudinary.com/dujoufris/video/upload/v1777429071/VID_20260428_191655_519_u8hkhn.mp4"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dujoufris/image/upload/v1777641972/20260501_185433_0000_tbcdh2.png"
  },
  {
    type: "video",
    url: "https://res.cloudinary.com/dujoufris/video/upload/v1777402211/VID_20260428_114405_631_lsgfyt.mp4"
  }
];

let container = document.getElementById("post-container");
let currentMedia = [];
let currentIndex = 0;
let startY = 0;
let videos = [];
let soundEnabled = false;

/* SOUND BUTTON */
const soundBtn = document.createElement("div");
soundBtn.id = "sound-toggle";
soundBtn.innerHTML = "🔇";
document.body.appendChild(soundBtn);

soundBtn.onclick = () => {
  soundEnabled = !soundEnabled;
  videos.forEach(v => v.muted = !soundEnabled);
  soundBtn.innerHTML = soundEnabled ? "🔊" : "🔇";
};

/* RENDER */
function renderFeed() {
  container.innerHTML = "";
  videos = [];

  currentMedia.forEach((item, index) => {
    const post = document.createElement("div");
    post.className = "post";
    post.style.transform = `translateY(${index * 100}%)`;

    let media;
    if (item.type === "video") {
      media = document.createElement("video");
      media.src = item.url;
      media.autoplay = true;
      media.loop = true;
      media.muted = true;
      videos.push(media);
    } else {
      media = document.createElement("img");
      media.src = item.url;
    }

    post.appendChild(media);
    container.appendChild(post);
  });

  attachSwipe();
  updatePosts();
}

/* SWIPE */
function attachSwipe() {
  container.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });

  container.addEventListener("touchend", e => {
    let diff = startY - e.changedTouches[0].clientY;
    if (diff > 50) nextPost();
    if (diff < -50) prevPost();
  });
}

/* UPDATE */
function updatePosts() {
  let posts = document.querySelectorAll(".post");

  posts.forEach((p, i) => {
    p.style.transform = `translateY(${(i - currentIndex) * 100}%)`;
  });

  videos.forEach(v => v.pause());

  let current = posts[currentIndex]?.querySelector("video");
  if (current) current.play();
}

function nextPost() {
  if (currentIndex < currentMedia.length - 1) {
    currentIndex++;
    updatePosts();
  }
}

function prevPost() {
  if (currentIndex > 0) {
    currentIndex--;
    updatePosts();
  }
}

/* FILTER */
function setFilter(type) {
  if (type === "video") {
    currentMedia = allMedia.filter(x => x.type === "video");
  } else if (type === "image") {
    currentMedia = allMedia.filter(x => x.type === "image");
  } else {
    currentMedia = [...allMedia];
  }

  currentIndex = 0;
  renderFeed();
}

/* NAV */
document.querySelectorAll(".nav-item").forEach(item => {
  item.onclick = () => {
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    setFilter(item.dataset.filter);
  };
});

/* START */
setFilter("video");
