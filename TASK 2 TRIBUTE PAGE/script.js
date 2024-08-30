
const About = () => {
    document.getElementById("card").style.display = "flex";
    document.getElementById("achievements-card").style.display = "none";
    document.getElementById("Gallery").style.display = "none";
};

const Ack = () => {
    document.getElementById("card").style.display = "none";
    document.getElementById("achievements-card").style.display = "flex";
    document.getElementById("Gallery").style.display = "none";
};

const Gallery = () => {
    document.getElementById("card").style.display = "none";
    document.getElementById("achievements-card").style.display = "none";
    document.getElementById("Gallery").style.display = "flex";
};