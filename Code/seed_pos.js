//Notas: seeds mais random;
// smaller

function put_seeds()
{
    const num_seeds = document.querySelector("#n_s input");
    const num_pots = document.querySelector("#n_p input");
    var board_scts = document.querySelectorAll(".section midsection");
    var board_sct_top = document.querySelector(".topmid");
    var board_sct_bot = document.querySelector(".botmid");
    var lrows = [board_sct_top, board_sct_bot];
    for(let k = 0; k < lrows.length; k++)
    {
        for(let i = 0; i < num_pots.value; i++)
        {
            let pot = document.createElement('div');
            pot.setAttribute('class', 'pot');
            for (let k = 0; k < num_seeds.value; k++)
            {
                let seed = document.createElement('div');
                seed.setAttribute('class', 'seeds');
                //semi-random drawing routine
                pot.appendChild(seed);
            }
            lrows[k].appendChild(pot);
        }
    }
}

window.addEventListener('load', function() {put_seeds();});