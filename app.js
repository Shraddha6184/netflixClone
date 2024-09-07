// Base URLs
const base_url = "https://api.themoviedb.org/3";
const banner_url = "https://image.tmdb.org/t/p/original";
const img_url = "https://image.tmdb.org/t/p/w300";

// Fetch URLs
const fetchTrending = `${base_url}/trending/tv/day?language=en-US`;
const fetchNetflixOriginals = `${base_url}/discover/tv?with_networks=213`;
const fetchPopularMovie = `${base_url}/discover/movie?certification_country=IN&certification.lte=G&sort_by=popularity.desc`;
const fetchPopularTv = `${base_url}/discover/tv?certification_country=IN&certification.lte=G&sort_by=popularity.desc`;
const fetchActionMovies = `${base_url}/discover/movie?with_genres=28`;
const fetchComedyMovies = `${base_url}/discover/movie?with_genres=35`;
const fetchHorrorMovies = `${base_url}/discover/movie?with_genres=27`;
const fetchRomanceMovies = `${base_url}/discover/movie?with_genres=10749`;
const fetchDocumentaries = `${base_url}/discover/movie?with_genres=99`;

let lastScrollY = window.scrollY;

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // Scroll down
        header.style.top = '-80px';
    } else {
        // Scroll up
        header.style.top = '0';
        if (window.scrollY > 0) {
            header.style.backgroundColor = 'black';
        } else {
            header.style.backgroundColor = 'transparent';
        }
    }
    lastScrollY = window.scrollY;
});

const fetchData = async (url) => {
    try {
        const response = await fetch("https://proxyserverapi.vercel.app/", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        });
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const setupHeroSection = async () => {
    const trendingData = await fetchData(fetchTrending);
    const randomShow = getRandomItem(trendingData);
    const heroSection = document.querySelector('.hero');

    heroSection.style.backgroundImage = `url(${banner_url}${randomShow.backdrop_path})`;

    const heroContent = document.querySelector('.hero-content');
    heroContent.querySelector('h1').textContent = randomShow.name;
    heroContent.querySelector('p').textContent = randomShow.overview;
};

const populateSection = async (fetchUrl, sectionSelector) => {
    const data = await fetchData(fetchUrl);
    const section = document.querySelector(sectionSelector);

    if (!section) {
        console.error(`Section ${sectionSelector} not found`);
        return;
    }

    data.forEach(item => {
        const cardHTML = `
            <div class="cardb">
                <img src="${img_url}${item.poster_path}" alt="${item.name || item.title}">
            </div>
        `;
        section.insertAdjacentHTML('beforeend', cardHTML);
    });
};

const init = async () => {
    await setupHeroSection();

    await populateSection(fetchNetflixOriginals, '#originals');
    await populateSection(fetchPopularMovie, '#trMovie');
    await populateSection(fetchPopularTv, '#trTv');
    await populateSection(fetchActionMovies, '#action');
    await populateSection(fetchComedyMovies, '#comedy');
    await populateSection(fetchHorrorMovies, '#horror');
    await populateSection(fetchRomanceMovies, '#romance');
    await populateSection(fetchDocumentaries, '#doc');

};

window.onload = init;