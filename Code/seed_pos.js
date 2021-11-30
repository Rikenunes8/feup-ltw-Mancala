//Notas: seeds mais random;
// smaller

function put_seeds()
{
    const num_seeds = document.querySelector("#n_s input");
    const num_pots = document.querySelector("#n_p input");
    //console.log("entrou");
    //console.log(num_seeds);
    //console.log(num_pots);
    var board_scts = document.querySelectorAll(".section midsection");
    var board_sct_top = document.querySelector(".topmid");
    var board_sct_bot = document.querySelector(".botmid");
    //console.log(board_sct_top);
    //console.log(board_sct_bot);
    for(let i = 0; i < num_pots.value; i++)
    {
        //console.log("a desenhar");
        let pot = document.createElement('div');
        //console.log("created pot");
        pot.setAttribute('class', 'pot');
        for (let k = 0; k < num_seeds.value; k++)
        {
            let seed = document.createElement('div');
            console.log("created seed");
            seed.setAttribute('class', 'seeds');
            //semi-random drawing routine
            pot.appendChild(seed);
        }
        board_sct_top.appendChild(pot);
    }

    for(let i = 0; i < num_pots.value; i++)
    {
        //console.log("a desenhar");
        let pot = document.createElement('div');
        //console.log("created pot");
        pot.setAttribute('class', 'pot');
        for (let k = 0; k < num_seeds.value; k++)
        {
            let seed = document.createElement('div');
            console.log("created seed");
            seed.setAttribute('class', 'seeds');
            //semi-random drawing routine
            pot.appendChild(seed);
        }
        board_sct_bot.appendChild(pot);
    }

}

window.addEventListener('load', function() {put_seeds();});