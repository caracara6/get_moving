

let randomSportArray = [
    {
        sport: "Yoga",
        index:0,
        randomSportImage:"images/yoga.jpg"
    },
    {
        sport :"Tennis",
        index: 1,
        randomSportImage:"images/tennis.jpg"
    },
    {
        sport: "Archery",
        index: 2,
        randomSportImage: "images/archery.jpg"
    },
    {
        sport: "Pilates",
        index: 3,
        randomSportImage: "images/pilates.jpg"
    },
    {
        sport: "Billiards",
        index: 4,
        randomSportImage: "images/billiards.jpg"
    },
    {
        sport: "Pole Dance",
        index: 5,
        randomSportImage: "images/pole_dance.jpg"
    },
    {
        sport: "Aikido",
        index: 6,
        randomSportImage: "images/aikido.jpg"
    },
    {
        sport: "Fencing",
        index: 7,
        randomSportImage: "images/fencing.jpg"
    },
    {
        sport: "Camping",
        index: 8,
        randomSportImage: "images/camping.jpg"
    },
    {
        sport: "Boxing",
        index: 9,
        randomSportImage: "images/boxing.jpg"
    },
    {
        sport: "Calisthenics",
        index: 10,
        randomSportImage: "images/calisthenics.jpg"
    }
]

function generateRandomSport() {
    randNum = Math.floor(Math.random() * randomSportArray.length);

    let randomSport = document.querySelector('#randomSport');
    let randomSportImage = document.querySelector('#randomSportImage');

    randomSport.innerHTML = randomSportArray[randNum].sport;
    randomSportImage.src = `${randomSportArray[randNum].randomSportImage}`;
    randomSportImage.alt = `${randomSportArray[randNum].sport} photo`

    return randomSport
}

