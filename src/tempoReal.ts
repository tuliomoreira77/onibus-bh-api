import * as axios from 'axios';
import * as csvParser from 'neat-csv';
import {Subject} from 'rxjs';

const tempoRealUrl = 'https://temporeal.pbh.gov.br/?param=D';
const debug_ = true;

var tempoRealData = null;
var nomeLinhas = null;
var moduleOk = false;
var tempoRealJob = null;
var subject = new Subject<any>();


export async function init() {
    nomeLinhas = await nomeLinhasParser();
    tempoRealData = await getRealTimePosition();
    moduleOk = true;
    tempoRealJob = setInterval(async () => {
        tempoRealData = await getRealTimePosition();
        subject.next();
    }, 20000);
}

export function getTempoRealData() {
    checkModuleOk();
    return tempoRealData;
}

export function subscribe(params:any) {
    subject.subscribe({
        next: (v) => {
            let result = tempoRealData.filter(elem => elem.numeroLinha == params.numeroLinha && elem.numeroVeiculo == 30373);
            params.callback(result);
        }
    });
}

function checkModuleOk() {
    if(!moduleOk) {
        throw new Error("Modulo nao iniciado");
    }
}

async function getRealTimePosition() {
    try {
        let tempoRealData = (await axios.default.get(tempoRealUrl)).data;
        const parsedData = [];
        for(let rawData of tempoRealData) {
            parsedData.push(infoTempoRealParser(rawData, nomeLinhas));
        }
        return parsedData;
    } catch(err) {
        debug(err);
        return tempoRealData;
    }
}

function infoTempoRealParser(tempoRealData:any, nomeLinhas:Array<any>) {
    return {
        evento: tempoRealData.EV,
        dataHora: parseDate(tempoRealData.HR),
        latitute: tempoRealData.LT,
        longitude:tempoRealData.LG,
        numeroVeiculo: tempoRealData.NV,
        velocidade: tempoRealData.VL,
        numeroLinha: tempoRealData.NL,
        linha: nomeLinhas.find(element => element.NumeroLinha == tempoRealData.NL),
        direcao: tempoRealData.DG,
        sentido: tempoRealData.SV == 1 ? 'ida' : 'volta',
        distanciaPercorrida: tempoRealData.DT,
    }
}

function parseDate(dateString:string) {
    let year = +dateString.slice(0, 4);
    let month = +dateString.slice(4, 6);
    let day = +dateString.slice(6,8);
    let hour = +dateString.slice(8,10);
    let minute = +dateString.slice(10,12);
    let second = +dateString.slice(12,14);

    return new Date(year, month-1, day, hour, minute, second);
}

async function nomeLinhasParser() {
    let nomeLinhas = await csvParser((await axios.default.get('http://servicosbhtrans.pbh.gov.br/bhtrans/webserviceGPS/bhtrans_bdlinha.csv')).data, { separator: ';' });
    return nomeLinhas;
}


function debug(message:any) {
    if(debug_) {
        console.log(message);
    }
}