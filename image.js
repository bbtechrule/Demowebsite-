// ----- ORIGINAL MEDIA DATA -----
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

// ----- SOUND BUTTON -----
const soundBtn = document.createElement("div");
soundBtn.id = "sound-toggle";
soundBtn.innerHTML = "🔇";
document.body.appendChild(soundBtn);

function updateAllVideosMuted() {
  videos.forEach(video => {
    video.muted = !soundEnabled;
  });
}

function updateSoundButtonVisibility() {
  const hasVideos = currentMedia.some(item => item.type === "video");
  soundBtn.style.display = hasVideos ? "flex" : "none";
}

soundBtn.onclick = () => {
  soundEnabled = !soundEnabled;
  updateAllVideosMuted();
  soundBtn.innerHTML = soundEnabled ? "🔊" : "🔇";
};

// ----- RENDER FEED -----
function renderFeed() {
  container.innerHTML = "";
  videos = [];

  currentMedia.forEach((item, index) => {
    const post = document.createElement("div");
    post.className = "post";
    post.style.transform = `translateY(${index * 100}%)`;

    const box = document.createElement("div");
    box.className = "media-box";

    let mediaElement;
    if (item.type === "image") {
      mediaElement = document.createElement("img");
      mediaElement.src = item.url;
      mediaElement.className = "post-img";
    } else if (item.type === "video") {
      mediaElement = document.createElement("video");
      mediaElement.src = item.url;
      mediaElement.className = "post-video";
      mediaElement.autoplay = true;
      mediaElement.loop = true;
      mediaElement.muted = true;
      mediaElement.playsInline = true;
      mediaElement.preload = "auto";
      videos.push(mediaElement);
    }

    box.appendChild(mediaElement);
    post.appendChild(box);
    container.appendChild(post);
  });

  attachSwipeEvents();
  updatePosts();
  updateAllVideosMuted();
  updateSoundButtonVisibility();
}

// ----- SWIPE LOGIC -----
let posts = [];

function attachSwipeEvents() {
  posts = document.querySelectorAll(".post");
  container.removeEventListener("touchstart", touchStartHandler);
  container.removeEventListener("touchmove", touchMoveHandler);
  container.removeEventListener("touchend", touchEndHandler);
  container.addEventListener("touchstart", touchStartHandler);
  container.addEventListener("touchmove", touchMoveHandler, { passive: false });
  container.addEventListener("touchend", touchEndHandler);
}

function touchStartHandler(e) {
  startY = e.touches[0].clientY;
}

function touchMoveHandler(e) {
  e.preventDefault();
}

function touchEndHandler(e) {
  let endY = e.changedTouches[0].clientY;
  let diff = startY - endY;
  if (diff > 50) nextPost();
  if (diff < -50) prevPost();
}

function updatePosts() {
  posts.forEach((post, index) => {
    post.style.transform = `translateY(${(index - currentIndex) * 100}%)`;
  });

  videos.forEach(video => video.pause());

  if (currentMedia[currentIndex] && currentMedia[currentIndex].type === "video") {
    const currentVideo = posts[currentIndex]?.querySelector("video");
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.muted = !soundEnabled;
      currentVideo.play().catch(e => console.log("play error", e));
    }
  }
}

function nextPost() {
  if (currentIndex < posts.length - 1) {
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

// ----- FILTER FUNCTION -----
function setFilter(type) {
  if (type === "all") {
    currentMedia = [...allMedia];
  } else if (type === "video") {
    currentMedia = allMedia.filter(item => item.type === "video");
  } else if (type === "image") {
    currentMedia = allMedia.filter(item => item.type === "image");
  } else if (type === "profile") {
    showProfileView();
    return;
  }

  currentIndex = 0;
  renderFeed();
}

// ----- PROFILE VIEW -----
function showProfileView() {
  container.innerHTML = `
    <div style="color: white; text-align: center; padding: 40px 20px; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <img src="https://img.icons8.com/ios-filled/100/ffffff/user.png" style="width: 80px; margin-bottom: 20px;">
      <h2>@VILLAGE_BOY_2229</h2>
      <p>Shorts UI</p>
      <p style="margin-top: 20px; font-size: 14px;">✨ 12 posts | 45 likes</p>
    </div>
  `;
  container.removeEventListener("touchstart", touchStartHandler);
  container.removeEventListener("touchmove", touchMoveHandler);
  container.removeEventListener("touchend", touchEndHandler);
  videos = [];
  soundBtn.style.display = "none";
}

// ----- BOTTOM NAV -----
function initBottomNav() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const filter = item.getAttribute("data-filter");
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      if (filter === "profile") {
        setFilter("profile");
      } else {
        setFilter(filter);
      }
    });
  });
}

// ----- INITIAL LOAD -----
setFilter("all");
initBottomNav();
