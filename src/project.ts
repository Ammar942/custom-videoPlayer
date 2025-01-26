let cont: HTMLElement;
interface VideoInter {
  container: string;
  source: string;
  theme?: string;
  skip?: number;
  muted?: boolean;
  autoplaying?: boolean;
}
let style: HTMLStyleElement;
class VideoPlayer implements VideoInter {
  container: string;
  source: string;
  theme?: string | undefined;
  skip?: number | undefined;
  muted?: boolean;
  autoplaying?: boolean;
  constructor(
    container: string,
    source: string,
    theme?: string,
    skip?: number,
    muted?: boolean,
    autoplaying?: boolean
  ) {
    this.container = container;
    this.source = source;
    if (typeof window !== "undefined") {
      const uniqueClass = `videoContainer-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      if (!style) {
        style = document.createElement("style");
        style.type = "text/css";
        document.head.appendChild(style);
      }
      cont = window.document.getElementById("container")!;
      const backgroundColor =
        theme && typeof theme === "string" ? theme : "black";
      style.textContent += `
    .${uniqueClass} input::-webkit-slider-thumb { 
       background: ${backgroundColor};
    }
  `;
      document.head.appendChild(style);
      let div = document.createElement("div") as HTMLElement;
      div.classList.add(uniqueClass);
      let divControls = document.createElement("div") as HTMLElement;
      let video = document.createElement("video") as HTMLVideoElement;
      divControls.style.background = `linear-gradient(to top,${
        theme || "black"
      },transparent)`;
      video.src = this.source;
      video.controls = false;
      video.autoplay = autoplaying || false;
      video.muted = muted || false;
      ////////////////////////////////////////////////////////////////
      let range: HTMLInputElement | null = null;
      range = document.createElement("input") as HTMLInputElement;
      range.type = "range";
      range.min = "0";
      range.step = "0.1";
      range.value = "0";
      range.max = `${video.duration}`;
      range.oninput = (e) => {
        if (video && e.target) {
          video.currentTime = (e.target as HTMLInputElement).valueAsNumber;
        }
      };
      video.addEventListener("timeupdate", () => {
        if (range && video) {
          const percentage = (video.currentTime / video.duration) * 100;
          range.value = video.currentTime.toString();

          range.style.background = `linear-gradient(to right, ${
            theme || "black"
          } ${percentage}%,rgb(98, 98, 98) ${percentage}%)`;
        }
      });
      video.addEventListener("loadedmetadata", () => {
        if (video && range) {
          range.max = `${video.duration}`;
        }
      });
      ////////////////////////////////////////////////////////////////
      let spantime: HTMLSpanElement | null = null;
      spantime = document.createElement("span") as HTMLSpanElement;
      spantime.textContent = "0:00";
      spantime.classList.add("spantime");
      let spanduration: HTMLSpanElement | null = null;
      spanduration = document.createElement("span") as HTMLSpanElement;
      video.addEventListener("loadedmetadata", () => {
        if (video && spanduration) {
          const minutes = Math.floor(video.duration / 60);
          const seconds = Math.floor(video.duration % 60);
          spanduration.textContent = `/ ${minutes}:${
            seconds < 10 ? "0" + seconds : seconds
          }`;
        }
      });
      video.addEventListener("timeupdate", () => {
        if (range && video) {
          const minutes = Math.floor(video.currentTime / 60);
          const seconds = Math.floor(video.currentTime % 60);
          spantime.innerHTML = `${minutes}:${
            seconds < 10 ? "0" + seconds : seconds
          }`;
        }
      });
      ////////////////////////////////////////////////////////////////
      let playbtn: HTMLInputElement | null = null;
      playbtn = document.createElement("i") as HTMLInputElement;
      playbtn.addEventListener("mouseover", () => {
        playbtn.style.color = theme || "black";
      });
      playbtn.addEventListener("mouseleave", () => {
        playbtn.style.color = "white";
      });
      playbtn.classList.add("fa-solid");
      if (autoplaying) {
        playbtn.classList.add("fa-pause");
      } else {
        playbtn.classList.add("fa-play");
        // playbtn.classList.remove("fa-pause");
      }
      playbtn.onclick = () => {
        if (video.paused) {
          video.play();
          playbtn.classList.remove("fa-play");
          playbtn.classList.add("fa-pause");
        } else {
          video.pause();
          playbtn.classList.remove("fa-pause");
          playbtn.classList.add("fa-play");
        }
      };
      video.addEventListener("timeupdate", function () {
        if (range.valueAsNumber.toFixed(1) == video.duration.toFixed(1)) {
          playbtn?.classList.remove("fa-pause");
          playbtn?.classList.add("fa-play");
        }
      });
      ////////////////////////////////////////////////////////////////
      let mutebtn: HTMLInputElement | null = null;
      mutebtn = document.createElement("i") as HTMLInputElement;
      mutebtn.addEventListener("mouseover", () => {
        mutebtn.style.color = theme || "black";
      });
      mutebtn.addEventListener("mouseleave", () => {
        mutebtn.style.color = "white";
      });
      mutebtn.classList.add("fa-solid");
      if (muted) {
        mutebtn.classList.add("fa-volume-low");
      } else {
        mutebtn.classList.add("fa-volume-high");
      }
      mutebtn.onclick = () => {
        if (video.muted) {
          video.muted = false;
          if (mutebtn) {
            mutebtn.classList.add("fa-volume-high");
            mutebtn.classList.remove("fa-volume-low");
          }
        } else {
          video.muted = true;
          if (mutebtn) {
            mutebtn.classList.remove("fa-volume-high");
            mutebtn.classList.add("fa-volume-low");
          }
        }
      };
      ////////////////////////////////////////////////////////////////
      let forward: HTMLElement | null = null;
      forward = document.createElement("i");
      forward.classList.add("fa-solid");
      forward.classList.add("fa-forward");
      forward.addEventListener("mouseover", () => {
        forward.style.color = theme || "black";
      });
      forward.addEventListener("mouseleave", () => {
        forward.style.color = "white";
      });
      forward.addEventListener("click", () => {
        if (video && video.currentTime < video.duration - 1) {
          video.currentTime += skip || 1;
        }
      }); ////////////////////////////////////////////////////////////////
      let backward: HTMLElement | null = null;
      backward = document.createElement("i");
      backward.classList.add("fa-solid");
      backward.classList.add("fa-backward");
      backward.addEventListener("mouseover", () => {
        backward.style.color = theme || "black";
      });
      backward.addEventListener("mouseleave", () => {
        backward.style.color = "white";
      });
      backward.addEventListener("click", () => {
        if (video && video.duration - 1 > video.currentTime) {
          video.currentTime = video.currentTime - (skip || 1);
        }
      });

      ////////////////////////////////////////////////////////////////
      let speedIcon = document.createElement("i") as HTMLElement;
      speedIcon.classList.add("fa-solid", "fa-tachometer-alt");
      speedIcon.style.cursor = "pointer";
      speedIcon.title = "Change Speed";

      let speedDropdown = document.createElement("div") as HTMLElement;
      speedDropdown.style.position = "absolute";
      speedDropdown.style.background = "#fff";
      speedDropdown.style.border = "1px solid #ccc";
      speedDropdown.style.display = "none";
      speedDropdown.style.zIndex = "1000";

      const speeds = [0.5, 1, 1.5, 2];
      speeds.forEach((speed) => {
        let speedOption = document.createElement("div") as HTMLElement;
        speedOption.innerHTML = `${speed}x <hr>`;
        speedOption.style.cursor = "pointer";
        speedOption.style.textAlign = "center";
        speedDropdown.style.right = "16px";
        speedDropdown.style.bottom = "32px";
        speedDropdown.style.padding = "5px";

        speedOption.onclick = () => {
          video.playbackRate = speed;
          speedDropdown.style.display = "none";
        };

        speedOption.onmouseover = () => {
          speedOption.style.background = theme || "#eee";
        };
        speedOption.onmouseout = () => {
          speedOption.style.background = "transparent";
        };

        speedDropdown.appendChild(speedOption);
      });

      speedIcon.onclick = () => {
        speedDropdown.style.display =
          speedDropdown.style.display === "none" ? "block" : "none";
      };
      speedIcon.addEventListener("mouseover", () => {
        speedIcon.style.color = theme || "black";
      });
      speedIcon.addEventListener("mouseleave", () => {
        speedIcon.style.color = "white";
      });
      ////////////////////////////////////////////////////////////////
      divControls.appendChild(mutebtn);
      divControls.appendChild(playbtn);
      divControls.appendChild(forward);
      divControls.appendChild(backward);
      divControls.appendChild(speedIcon);
      divControls.appendChild(speedDropdown);
      divControls.appendChild(range);
      divControls.appendChild(spantime);
      divControls.appendChild(spanduration);
      div.appendChild(video);
      div.appendChild(divControls);
      cont?.appendChild(div);

      divControls.setAttribute("class", "divControls");
      div.classList.add("videoContainer");
    }
  }
}
let vp = new VideoPlayer(
  "container",
  "../Mingle Game Song “Round and Round” Lyric Video .mp4",
  "red",
  5,
  true,
  true
);
let vp2 = new VideoPlayer(
  "container",
  "../Mingle Game Song “Round and Round” Lyric Video .mp4",
  "blue",
  3,
  true,
  false
);

let vp3 = new VideoPlayer(
  "container",
  "../Mingle Game Song “Round and Round” Lyric Video .mp4",
  "violet",
  10
);
// let vp4 = new VideoPlayer(
//   "container",
//   "../Mingle Game Song “Round and Round” Lyric Video .mp4"
// );
