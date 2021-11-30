function put_seeds()
{
    const num_seeds = document.querySelector("#n_s input");
    const num_pots = document.querySelector("#n_p input");
    //console.log(num_seeds);
    var board_scts = document.querySelectorAll(".section midsection");
    var board_sct_top = board_scts.querySelector(".midrow topmid");
    var board_sct_bot = board_scts.querySelector(".midrow botmid");

    for(let i = 0; i < num_pots; i++)
    {
        let pot = document.createElement('div');
        pot.setAttribute('class', 'pot');
        for (let k = 0; k < num_seeds; k++)
        {
            let seed = document.createElement('div');
            seed.setAttribute('class', 'seeds');
            //semi-random drawing routine
            pot.appendChild(seed);
        }
        board_sct_top.appendChild(pot);
        board_sct_bot.appendChild(pot);
    }

}

window.onload = put_seeds()