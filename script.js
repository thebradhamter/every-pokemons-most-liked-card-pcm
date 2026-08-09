const template = "https://api.pokecardmaker.net/cards?limit=16&includedTags%5B%5D=serious&search=POKEMONNAME&sortBy=new&cursor=CURSORPOS";
const pokemonnameinput = document.getElementById("pokemonnameinput");
const searchbtn = document.getElementById("searchbtn");
const resultbox = document.getElementById("resultbox");
const status = document.getElementById("status");
const searchbox = document.getElementById("searchbox");
const cardlist = document.getElementById("cardlist");

async function getAllCards(pokemonName){
    let cursor = 0;
    let cards = [];
    status.style.display = "block";
    while (true) {
        status.innerHTML = `Getting page ${cursor.toString()} for "${pokemonName}"...`;
        const call = await fetch("https://corsproxy.io/?url="+encodeURIComponent(template.replaceAll("POKEMONNAME", pokemonName).replaceAll("CURSORPOS", cursor.toString())));
        const data = await call.json();
        cards.push(...data.items);
        if (data.nextCursor) {
            cursor += 1;
        } else {
            break;
        };
    };
    status.style.display = "none";
    return cards;
};

function sortLikesDescending(cards) {
    return cards.sort((a, b) => b.likeCount - a.likeCount);
};

function loadCardsInHtml(cards) {
    cardlist.replaceChildren();
    i = 0;
    for (const card of cards) {
        i += 1;
        const e = document.createElement("p");
        const a1 = document.createElement("a");
        a1.href = `https://pokecardmaker.net/card/${card.user.username}/${card.slug}`;
        a1.target = "_blank";
        a1.rel = "noopener noreferrer";
        if (card.subname) {
            a1.innerHTML = `${card.subname} ${card.name}`;
        } else {
            a1.innerHTML = card.name;
        }
        const a2 = document.createElement("a");
        a2.href = `https://pokecardmaker.net/profile/${card.user.username}`;
        a2.target = "_blank";
        a2.rel = "noopener noreferrer";
        a2.innerHTML = card.user.username;
        e.appendChild(document.createTextNode(`${i.toString()}. `));
        e.appendChild(a1);
        e.appendChild(document.createTextNode(" by "));
        e.appendChild(a2);
        e.appendChild(document.createTextNode(` - ${card.likeCount.toString()} likes`));
        cardlist.appendChild(e);
    };
};

async function search() {
    e = pokemonnameinput.value.trim()
    if (e) {
        resultbox.style.display = "block";
        const cards = await getAllCards(e);
        const cardsOrder = sortLikesDescending(cards);
        // console.log(cards);
        loadCardsInHtml(cardsOrder);
    } else {
        alert("Input a Pokémon name into the field.");
    };
}

searchbtn.onclick = async function() {
    search();
};

pokemonnameinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        search();
    };
});

resultbox.style.display = "none";