"use strict";
let cont;
let style;
class VideoPlayer {
    constructor(container, source, theme, skip, muted, autoplaying) {
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
            cont = window.document.getElementById("container");
            const backgroundColor = theme && typeof theme === "string" ? theme : "black";
            style.textContent += `
    .${uniqueClass} input::-webkit-slider-thumb { 
       background: ${backgroundColor};
    }
  `;
            document.head.appendChild(style);
            let div = document.createElement("div");
            div.classList.add(uniqueClass);
            let divControls = document.createElement("div");
            let video = document.createElement("video");
            divControls.style.background = `linear-gradient(to top,${theme || "black"},transparent)`;
            video.src = this.source;
            video.controls = false;
            video.autoplay = autoplaying || false;
            video.muted = muted || false;
            ////////////////////////////////////////////////////////////////
            let range = null;
            range = document.createElement("input");
            range.type = "range";
            range.min = "0";
            range.step = "0.1";
            range.value = "0";
            range.max = `${video.duration}`;
            range.oninput = (e) => {
                if (video && e.target) {
                    video.currentTime = e.target.valueAsNumber;
                }
            };
            video.addEventListener("timeupdate", () => {
                if (range && video) {
                    const percentage = (video.currentTime / video.duration) * 100;
                    range.value = video.currentTime.toString();
                    range.style.background = `linear-gradient(to right, ${theme || "black"} ${percentage}%,rgb(98, 98, 98) ${percentage}%)`;
                }
            });
            video.addEventListener("loadedmetadata", () => {
                if (video && range) {
                    range.max = `${video.duration}`;
                }
            });
            ////////////////////////////////////////////////////////////////
            let spantime = null;
            spantime = document.createElement("span");
            spantime.textContent = "0:00";
            spantime.classList.add("spantime");
            let spanduration = null;
            spanduration = document.createElement("span");
            video.addEventListener("loadedmetadata", () => {
                if (video && spanduration) {
                    const minutes = Math.floor(video.duration / 60);
                    const seconds = Math.floor(video.duration % 60);
                    spanduration.textContent = `/ ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                }
            });
            video.addEventListener("timeupdate", () => {
                if (range && video) {
                    const minutes = Math.floor(video.currentTime / 60);
                    const seconds = Math.floor(video.currentTime % 60);
                    spantime.innerHTML = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                }
            });
            ////////////////////////////////////////////////////////////////
            let playbtn = null;
            playbtn = document.createElement("i");
            playbtn.addEventListener("mouseover", () => {
                playbtn.style.color = theme || "black";
            });
            playbtn.addEventListener("mouseleave", () => {
                playbtn.style.color = "white";
            });
            playbtn.classList.add("fa-solid");
            if (autoplaying) {
                playbtn.classList.add("fa-pause");
            }
            else {
                playbtn.classList.add("fa-play");
                // playbtn.classList.remove("fa-pause");
            }
            playbtn.onclick = () => {
                if (video.paused) {
                    video.play();
                    playbtn.classList.remove("fa-play");
                    playbtn.classList.add("fa-pause");
                }
                else {
                    video.pause();
                    playbtn.classList.remove("fa-pause");
                    playbtn.classList.add("fa-play");
                }
            };
            ////////////////////////////////////////////////////////////////
            let mutebtn = null;
            mutebtn = document.createElement("i");
            mutebtn.addEventListener("mouseover", () => {
                mutebtn.style.color = theme || "black";
            });
            mutebtn.addEventListener("mouseleave", () => {
                mutebtn.style.color = "white";
            });
            mutebtn.classList.add("fa-solid");
            if (muted) {
                mutebtn.classList.add("fa-volume-low");
            }
            else {
                mutebtn.classList.add("fa-volume-high");
            }
            mutebtn.onclick = () => {
                if (video.muted) {
                    video.muted = false;
                    if (mutebtn) {
                        mutebtn.classList.add("fa-volume-high");
                        mutebtn.classList.remove("fa-volume-low");
                    }
                }
                else {
                    video.muted = true;
                    if (mutebtn) {
                        mutebtn.classList.remove("fa-volume-high");
                        mutebtn.classList.add("fa-volume-low");
                    }
                }
            };
            ////////////////////////////////////////////////////////////////
            let forward = null;
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
            let backward = null;
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
            let speedIcon = document.createElement("i");
            speedIcon.classList.add("fa-solid", "fa-tachometer-alt");
            speedIcon.style.cursor = "pointer";
            speedIcon.title = "Change Speed";
            let speedDropdown = document.createElement("div");
            speedDropdown.style.position = "absolute";
            speedDropdown.style.background = "#fff";
            speedDropdown.style.border = "1px solid #ccc";
            speedDropdown.style.display = "none";
            speedDropdown.style.zIndex = "1000";
            const speeds = [0.5, 1, 1.5, 2];
            speeds.forEach((speed) => {
                let speedOption = document.createElement("div");
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
            cont === null || cont === void 0 ? void 0 : cont.appendChild(div);
            divControls.setAttribute("class", "divControls");
            div.classList.add("videoContainer");
        }
    }
}
let vp = new VideoPlayer("container", "../Mingle Game Song “Round and Round” Lyric Video .mp4", "red", 5, true, true);
let vp2 = new VideoPlayer("container", "../Mingle Game Song “Round and Round” Lyric Video .mp4", "black", 3, true, false);
let vp3 = new VideoPlayer("container", "../Mingle Game Song “Round and Round” Lyric Video .mp4", "blue");
// let vp4 = new VideoPlayer(
//   "container",
//   "../Mingle Game Song “Round and Round” Lyric Video .mp4"
// );
