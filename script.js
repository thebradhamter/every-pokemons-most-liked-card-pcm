const template = "https://api.pokecardmaker.net/cards?limit=16&includedTags%5B%5D=serious&search=POKEMONNAME&sortBy=new&cursor=CURSORPOS";
const resultbox = document.getElementById("resultbox");
const status = document.getElementById("status");
const searchbox = document.getElementById("searchbox");
const pokemonnameinput = document.getElementById("pokemonnameinput");
const searchbtn = document.getElementById("searchbtn");

async function getAllCards(pokemonName){
    let cursor = 0;
    let cards = [];
    while (true) {
        status.value = `Getting page ${cursor.toString()} for "${pokemonName}"...`;
        const call = await fetch("https://proxy.corsfix.com/?"+template.replaceAll("POKEMONNAME", pokemonName).replaceAll("CURSORPOS", cursor.toString()));
        const data = await call.json();
        cards.push(data.items);
        if (call.nextCursor) {
            cursor += 1;
        } else {
            break;
        };
    };
    status.value = `All pages loaded for "${pokemonName}"!`;
    return cards;
};

function sortLikesDescending(cards) {
    return cards.sort((a, b) => b.likeCount - a.likeCount);
};

searchbtn.onclick = async function() {
    e = pokemonnameinput.value.trim()
    if (e) {
        resultbox.style.display = "block";
        const cards = await getAllCards(e);
        const cardsOrder = sortLikesDescending(cards.flat());
        console.log(cards);
    } else {
        alert("Input a Pokémon name into the field.");
    };
};

resultbox.style.display = "none";