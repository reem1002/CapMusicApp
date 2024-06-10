import data from './data.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const darkModeToggle = document.getElementById('theme');
    let current = parseInt(sessionStorage.getItem('current')) || 0;
    let playlistQueue = JSON.parse(sessionStorage.getItem('playlistQueue')) || [];
    let favplaylist = JSON.parse(localStorage.getItem('favplaylist')) || [];
    let favheart;
    const main = document.getElementById("mainSec");
    const playList = document.getElementById("playList");
    const playList2 = document.getElementById("playList2");
    const fav = document.getElementById("fav");
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById("playButton");
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");
    const bar = document.getElementById("progressBar");
    const duration = document.getElementById("duration");
    const start = document.getElementById("start");
    const searchInput = document.getElementById("searchinput");
    const searchBtn = document.getElementById("searchBtn");
    const repeat = document.getElementById("repeatAll");
    const favList = document.getElementById("favList");
    const listQueue = document.getElementById("listQueue");
    
    favList.addEventListener("click",()=>{
        fav.classList.toggle("favAppear");
        playList.classList.remove("Appear")
        playList2.classList.remove("secapp");
    }) 
    listQueue.addEventListener("click",()=>{
        playList.classList.toggle("Appear");
        playList2.classList.toggle("secapp");
        fav.classList.remove("favAppear");
    }) 

    const toggleDarkMode = () => {
        location.reload()
        if (root.classList.contains('darkTheme')) {
            darkModeOff();
            localStorage.setItem("darkMode", "0"); // Save preference
        } else {
            darkModeOn();
            localStorage.setItem("darkMode", "1"); // Save preference
        }
    };

    const setupTheme = () => {
        if (localStorage.getItem("darkMode") === "1") {
            darkModeOn();
        } else {
            darkModeOff();
        }
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Function to enable dark mode
    function darkModeOn() {
        root.classList.add('darkTheme');
        document.querySelector("#playButton img").setAttribute("src", "./assets/imgs/play-dark.png");
        document.querySelector("#next img").setAttribute("src", "./assets/imgs/next-button-dark.png");
        document.querySelector("#prev img").setAttribute("src", "./assets/imgs/previous-dark.png");
        document.querySelector("#theme img").setAttribute("src", "./assets/imgs/light_mode.svg");
        document.querySelector("#repeatAll img").setAttribute("src", "./assets/imgs/repeat-dark.svg");
        document.querySelector("#listQueue img").setAttribute("src", "./assets/imgs/queue-dark.svg");
        document.querySelector("#favList img").setAttribute("src", "./assets/imgs/favoritelist-dark.png");
        
        
        


    }

    // Function to disable dark mode
    function darkModeOff() {
        root.classList.remove('darkTheme');
        document.querySelector("#playButton img").setAttribute("src", "./assets/imgs/play.png");
        document.querySelector("#next img").setAttribute("src", "./assets/imgs/next.png");
        document.querySelector("#prev img").setAttribute("src", "./assets/imgs/previous.png");
        document.querySelector("#theme img").setAttribute("src", "./assets/imgs/dark.png");
        document.querySelector("#repeatAll img").setAttribute("src", "./assets/imgs/repeat.svg");
        document.querySelector("#listQueue img").setAttribute("src", "./assets/imgs/queue.svg");
        document.querySelector("#favList img").setAttribute("src", "./assets/imgs/favoritelist.png");
    }

    // Call setupTheme when the DOM content is loaded
    setupTheme();

    

    // Add titles to favorites and queue sections
    let title = document.createElement('h2');
    title.textContent = "Your Favorites";
    title.style.paddingLeft = "10px";
    title.style.paddingTop = "10px";
    title.style.marginBottom = "20px";
    

    let fixedTitle = document.createElement("div");
    fixedTitle.appendChild(title);
    fixedTitle.classList.add("fixedTitle");
    fav.prepend(fixedTitle);

    let title2 = document.createElement('h2');
    title2.textContent = "In Queue";
    title2.style.paddingLeft = "10px";
    title2.style.paddingTop = "10px";
    title2.style.marginBottom = "20px";
    
    let fixedTitle2 = document.createElement("div");
    fixedTitle2.appendChild(title2);
    fixedTitle2.classList.add("fixedTitle");
    playList.prepend(fixedTitle2);

    // Add button to play all favorites
    let playFavsButton = document.createElement("button");
    let playallfav = document.createElement("img");
    if (localStorage.getItem("darkMode") === "1") {
        playallfav.src="./assets/imgs/play_circle-dark.svg";
    } else {
        playallfav.src="./assets/imgs/play_circle.svg";
    }
    
    playFavsButton.classList.add("favallBtn")
    playFavsButton.appendChild(playallfav);
    playFavsButton.style.marginLeft = "10px";
    
    fav.appendChild(playFavsButton);
    playallfav.classList.add("iconhov");
    const createButton = (className, imgSrc, marginLeft) => {
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = imgSrc;
        button.classList.add(className);
        button.appendChild(img);
        button.style.marginLeft = marginLeft;
        return button;
    };
    let clearallButton = createButton("clearBtn", "./assets/imgs/clear.svg", "10px");
    let closeBtn = createButton("closeBtn", "./assets/imgs/remove.svg", "10px");
    let closeBtn2 = createButton("closeBtn", "./assets/imgs/remove.svg", "10px");
    closeBtn.classList.add("iconhov");
    fav.appendChild(closeBtn);
    playList.appendChild(closeBtn2);
    playList.appendChild(clearallButton);
    clearallButton.classList.add("iconhov");
    if (localStorage.getItem("darkMode") === "1") {
        clearallButton.querySelector("img").src="./assets/imgs/clear-dark.svg";
        closeBtn.querySelector("img").src="./assets/imgs/remove-dark.svg";
        closeBtn2.querySelector("img").src="./assets/imgs/remove-dark.svg";
    } else {
        clearallButton.querySelector("img").src="./assets/imgs/clear.svg";
        closeBtn.querySelector("img").src="./assets/imgs/remove.svg";
        closeBtn2.querySelector("img").src="./assets/imgs/remove.svg";
    }

    // Check if essential elements exist
    if (!main || !playList || !fav || !audio || !playBtn || !next || !prev || !bar || !duration || !start || !searchInput || !searchBtn) {
        console.error('One or more essential elements are not found');
        return;
    }

    const updateFavoriteIcon = (ele) => {
        const heartId = `${ele.title.replace(/ /g, "-")}`;
        const favHeartId = `fav-${heartId}`;
        
        const heartElementMain = document.getElementById(heartId);
        const heartElementQueue = document.getElementById(favHeartId);
    
        const isFavorite = favplaylist.some(fav => fav.title === ele.title);
        let heartSrc;
        if (localStorage.getItem("darkMode") === "1") {
             heartSrc = isFavorite ? "./assets/imgs/heart_check-dark.svg" : "./assets/imgs/favorite2-dark.svg";
        } else {
             heartSrc = isFavorite ? "./assets/imgs/heart_check.svg" : "./assets/imgs/favorite2.svg";
        }
    
        if (heartElementMain) {
            heartElementMain.src = heartSrc;
        }
    
        if (heartElementQueue) {
            heartElementQueue.src = heartSrc;
        }
    };
    
    const displayMain = (filteredData) => {
        main.innerHTML = "";
        (filteredData || data).forEach((ele) => {
            let card = document.createElement("div");
            card.classList.add("card");
    
            let img = document.createElement("img");
            img.src = `./assets/imgs/${ele.title}.jpg`;
            img.onerror = () => {
                img.src = `./assets/imgs/${ele.artist}.jpg`;
                img.onerror = () => img.src = "./assets/imgs/placeholder.png";
            };
    
            let name = document.createElement("p");
            name.textContent = `${ele.title}`;
            name.classList.add("cardName");
    
            let art = document.createElement("p");
            art.textContent = `${ele.artist}`;
            art.classList.add("art");
    
            let fontDiv = document.createElement("div");
            fontDiv.classList.add("fontDiv");
            let addtofavs = document.createElement("button");
            addtofavs.classList.add("favCard");
            addtofavs.style.right = "50px";
            let addtolist = document.createElement("button");
            addtolist.classList.add("listCard");
            addtolist.style.right = "100px";
            let cardBtns = document.createElement("div");
            cardBtns.classList.add("cardBtns");
    
            let heart = document.createElement("img");
            let add = document.createElement("img");
            add.classList.add("iconhov");
heart.id = `fav-${ele.title.replace(/ /g, "-")}`;
add.id = `add-${ele.title.replace(/ /g, "-")}`;

if (localStorage.getItem("darkMode") === "1") {
    heart.src = favplaylist.some(fav => fav.title === ele.title) 
        ? "./assets/imgs/heart_check-dark.svg" 
        : "./assets/imgs/favorite2-dark.svg";
} else {
    heart.src = favplaylist.some(fav => fav.title === ele.title) 
        ? "./assets/imgs/heart_check.svg" 
        : "./assets/imgs/favorite2.svg";
}
if (localStorage.getItem("darkMode") === "1") {
    add.src = "./assets/imgs/add-dark.svg";
} else {
    add.src = "./assets/imgs/add.svg";
}
            addtofavs.appendChild(heart);
            addtolist.appendChild(add);
    
            addtofavs.addEventListener("click", () => {
                if (!favplaylist.some(fav => fav.title === ele.title)) {
                    favplaylist.push(ele);
                } else {
                    favplaylist = favplaylist.filter(element => element.title !== ele.title);
                }
                saveFavPlayList();
                updateFavoriteIcon(ele);
                displayfavPlayList();
            });
    
            img.addEventListener("click", () => {
                playlistQueue.push(ele);
                savePlaylistQueue();
                displayPlayList();
                playSong(playlistQueue.length-1);
            });
    
            fontDiv.addEventListener("click", () => {
                playlistQueue.push(ele);
                savePlaylistQueue();
                displayPlayList();
                playSong(playlistQueue.length-1);
            });
            addtolist.addEventListener("click", () => {
                playlistQueue.push(ele);
                savePlaylistQueue();
                displayPlayList();
                if (playlistQueue.length === 1) {
                    playSong(0);
                }
            });
    
            card.appendChild(img);
            fontDiv.appendChild(name);
            fontDiv.appendChild(art);
            card.appendChild(fontDiv);
            cardBtns.appendChild(addtofavs);
            cardBtns.appendChild(addtolist);
            card.appendChild(cardBtns);
            main.appendChild(card);
        });
    };
    
    displayMain();
    
    const displayPlayList = () => {
        playList.innerHTML = "";
        playList.appendChild(clearallButton);
        playList.appendChild(closeBtn2);
        closeBtn2.addEventListener("click",()=>{
            playList.classList.remove("Appear")
            playList2.classList.remove("secapp");
        });

        let playListDiv = document.createElement('div');
        playList.prepend(fixedTitle2);
    
        playlistQueue.forEach((ele, index) => {
            let playlistSong = document.createElement("div");
            playlistSong.classList.add("psong");
    
            let songImg = document.createElement("img");
            songImg.src = `./assets/imgs/${ele.title}.jpg`;
            songImg.onerror = () => {
                songImg.src = `./assets/imgs/${ele.artist}.jpg`;
                songImg.onerror = () => songImg.src = "./assets/imgs/placeholder.png";
            };
    
            let names = document.createElement("div");
            let songName = document.createElement("p");
            let songartist = document.createElement("p");
    
            let addtofavs = document.createElement("button");
            addtofavs.style.right = "50px";
    
            let heart = document.createElement("img");
            heart.classList.add("iconhov");
heart.id = `fav-${ele.title.replace(/ /g, "-")}`;

if (localStorage.getItem("darkMode") === "1") {
    heart.src = favplaylist.some(fav => fav.title === ele.title) 
        ? "./assets/imgs/heart_check-dark.svg" 
        : "./assets/imgs/favorite2-dark.svg";
} else {
    heart.src = favplaylist.some(fav => fav.title === ele.title) 
        ? "./assets/imgs/heart_check.svg" 
        : "./assets/imgs/favorite2.svg";
}
            addtofavs.appendChild(heart);
    
            
            
    
            let removefromqueue = document.createElement("button");
            let removeimg = document.createElement('img');
            removeimg.classList.add("iconhov");
            if (localStorage.getItem("darkMode") === "1") {
                removeimg.src = "./assets/imgs/remove-dark.svg";
            } else {
                removeimg.src = "./assets/imgs/remove.svg";
            }
            
            removefromqueue.appendChild(removeimg);
    
            songartist.classList.add("artist");
            songartist.textContent = ele.artist;
            songName.textContent = ele.title;
    
            playlistSong.appendChild(songImg);
            names.appendChild(songName);
            names.appendChild(songartist);
            playlistSong.appendChild(names);
            playlistSong.appendChild(addtofavs);
            playlistSong.appendChild(removefromqueue);
            playListDiv.appendChild(playlistSong);
    
            names.addEventListener("click", () => {
                current = index;
                playSong(current);
            });
    
            songImg.addEventListener("click", () => {
                current = index;
                playSong(current);
            });
    
            addtofavs.addEventListener("click", () => {
                if (!favplaylist.some(fav => fav.title === ele.title)) {
                    favplaylist.push(ele);
                    if (localStorage.getItem("darkMode") === "1") {
                        heart.src = favplaylist.some(fav => fav.title === ele.title) 
                            ? "./assets/imgs/heart_check-dark.svg" 
                            : "./assets/imgs/favorite2-dark.svg";
                    } else {
                        heart.src = favplaylist.some(fav => fav.title === ele.title) 
                            ? "./assets/imgs/heart_check.svg" 
                            : "./assets/imgs/favorite2.svg";
                    }

                } else {
                    favplaylist = favplaylist.filter(element => element.title !== ele.title);
                    if (localStorage.getItem("darkMode") === "1") {
                        heart.src = favplaylist.some(fav => fav.title === ele.title) 
                            ? "./assets/imgs/heart_check-dark.svg" 
                            : "./assets/imgs/favorite2-dark.svg";
                    } else {
                        heart.src = favplaylist.some(fav => fav.title === ele.title) 
                            ? "./assets/imgs/heart_check.svg" 
                            : "./assets/imgs/favorite2.svg";
                    }
                }
                saveFavPlayList();
                updateFavoriteIcon(ele);
                displayfavPlayList();
            });
    
            removefromqueue.addEventListener("click", () => {
                playlistQueue.splice(index, 1);
                savePlaylistQueue();
                displayPlayList();
                if (playlistQueue.length === 0) {
                    audio.pause();
                    audio.src = "";
                }
            });
    
            if (index === current) {
                playlistSong.classList.add('playing');
            } else {
                playlistSong.classList.remove('playing');
            }
        });
        playListDiv.classList.add("overflowp")

        playList.append(playListDiv);
    };
    
    clearallButton.addEventListener("click", () => {
        playlistQueue = [];
        savePlaylistQueue();
        audio.pause();
        audio.src = "";
        displayPlayList();
    });
    
    const displayfavPlayList = () => {
        fav.innerHTML = "";
    
        fav.prepend(fixedTitle);
        fav.appendChild(playFavsButton);
        fav.appendChild(closeBtn);
        closeBtn.addEventListener("click",()=>{
            fav.classList.remove("favAppear");
            
        });
    
        favplaylist.forEach((ele, index) => {
            let playlistSong = document.createElement("div");
            playlistSong.classList.add("fsong");
    
            let songImg = document.createElement("img");
            songImg.src = `./assets/imgs/${ele.title}.jpg`;
            songImg.onerror = () => {
                songImg.src = `./assets/imgs/${ele.artist}.jpg`;
                songImg.onerror = () => songImg.src = "./assets/imgs/placeholder.png";
            };
    
            let names = document.createElement("div");
            let songName = document.createElement("p");
            let songartist = document.createElement("p");
    
            let removefromfav = document.createElement("button");
            let removeimg = document.createElement('img');
            if (localStorage.getItem("darkMode") === "1") {
                removeimg.src = "./assets/imgs/remove-dark.svg";
            } else {
                removeimg.src = "./assets/imgs/remove.svg";
            }
            removeimg.classList.add("iconhov");
            removefromfav.appendChild(removeimg);
    
            let addtoqueue = document.createElement("button");
            let plus = document.createElement("img");
            if (localStorage.getItem("darkMode") === "1") {
                plus.src = "./assets/imgs/add-dark.svg";
            } else {
                plus.src = "./assets/imgs/add.svg";
            }
            
            plus.classList.add("iconhov");
            addtoqueue.appendChild(plus);
            addtoqueue.style.right = "50px";
    
            songartist.classList.add("artist");
            songartist.textContent = ele.artist;
            songName.textContent = ele.title;
    
            playlistSong.appendChild(songImg);
            names.appendChild(songName);
            names.appendChild(songartist);
            playlistSong.appendChild(names);
            playlistSong.appendChild(removefromfav);
            playlistSong.appendChild(addtoqueue);
            fav.appendChild(playlistSong);
    
            removefromfav.addEventListener("click", () => {
                favplaylist.splice(index, 1);
                saveFavPlayList();
                updateFavoriteIcon(ele);
                displayfavPlayList();
            });
    
            addtoqueue.addEventListener("click", () => {
                playlistQueue.push(ele);
                savePlaylistQueue();
                displayPlayList();
                if (playlistQueue.length === 1) {
                    playSong(0);
                }
            });
        });
    };
    
    

    const saveFavPlayList = () => {
        localStorage.setItem('favplaylist', JSON.stringify(favplaylist));
    };

    const savePlaylistQueue = () => {
        sessionStorage.setItem('playlistQueue', JSON.stringify(playlistQueue));
    };

    // Format time in mm:ss
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update the audio source and play the song
    const playSong = (index) => {
        if (playlistQueue.length > 0) {
            current = index;
            sessionStorage.setItem('current', current);
            audio.src = `${playlistQueue[index].path}`;
            audio.play();
            if (localStorage.getItem("darkMode") === "1") {
                playBtn.querySelector("img").src = "./assets/imgs/pause-dark.png";
            } else {
                playBtn.querySelector("img").src = "./assets/imgs/pause.png";
            }
            
            displayPlayList(); 
        }
    };

    // Play the next song in the queue
    const nextSong = () => {
        current = (current < playlistQueue.length - 1) ? current + 1 : 0;
        sessionStorage.setItem('current', current);
        playSong(current);
    };

    // Play the previous song in the queue
    const prevSong = () => {
        current = (current > 0) ? current - 1 : playlistQueue.length - 1;
        sessionStorage.setItem('current', current);
        playSong(current);
    };

    // Handle play/pause toggle
    const media = () => {
        if (audio.paused) {
            audio.play();
            if (localStorage.getItem("darkMode") === "1") {
                playBtn.querySelector("img").src = "./assets/imgs/pause-dark.png";
            } else {
                playBtn.querySelector("img").src = "./assets/imgs/pause.png";
            }
        } else {
            audio.pause();
            if (localStorage.getItem("darkMode") === "1") {
                playBtn.querySelector("img").src = "./assets/imgs/play-dark.png";;
            } else {
                playBtn.querySelector("img").src = "./assets/imgs/play.png";
            }
            
        }
    };

    // Set up the audio queue and update duration
    const playQueue = () => {
        audio.onended = () => {
            nextSong();
        };
        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(audio.duration);
        });
    };
    playQueue();

    // Update progress bar and time
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const audioDuration = audio.duration;
        bar.value = (currentTime / audioDuration) * 100;
        start.textContent = formatTime(currentTime);
    });

    // Seek functionality
    bar.addEventListener('input', () => {
        const audioDuration = audio.duration;
        const newTime = (bar.value / 100) * audioDuration;
        audio.currentTime = newTime;
    });

    // Initial load
    if (playlistQueue.length > 0) {
        audio.src = `${playlistQueue[current].path}`;
        duration.innerText = formatTime(audio.duration);
    }

    // Load and display the favorites on page load
    displayfavPlayList();

    // Load and display the playlist queue on page load
    displayPlayList();

    // Event listeners for control buttons
    prev.addEventListener("click", prevSong);
    next.addEventListener("click", nextSong);
    playBtn.addEventListener("click", media);

    // Event listener for the play all favorites button
    playFavsButton.addEventListener("click", () => {
        playlistQueue = [...favplaylist];
        savePlaylistQueue();
        displayPlayList();
        playSong(0); // Start playing the first song in the new queue
    });


    repeat.addEventListener("click", () => {
        if (audio.loop) {
            audio.loop = false;
            if (localStorage.getItem("darkMode") === "1") {
                repeat.querySelector("img").src = "./assets/imgs/repeat-dark.svg";
            } else {
                repeat.querySelector("img").src = "./assets/imgs/repeat.svg";
            }
        } else {
            audio.loop = true;
            if (localStorage.getItem("darkMode") === "1") {
                repeat.querySelector("img").src = "./assets/imgs/repeat-one-dark.svg";
            } else {
                repeat.querySelector("img").src = "./assets/imgs/repeat_one.svg";
            }
        }
    });
    
    
    // Event listener for the search button
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();
        const filteredData = data.filter(song => song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query));
        displayMain(filteredData);
    });
});
