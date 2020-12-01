import * as axios from 'axios';
import * as csvParser from 'neat-csv';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import * as tempoRealService from './tempoReal';



async function getInfoTempoReal() {
    let linha = 5713;
    await tempoRealService.init();
    /*tempoRealService.subscribe({
        numeroLinha: linha,
        callback: (result) => {
            console.log(result);
        }
    });*/
}


getInfoTempoReal();
