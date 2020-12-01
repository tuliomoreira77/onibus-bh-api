import * as csvParser from 'neat-csv';
import * as axios from 'axios';

const itinerario_url = "https://prefeitura.pbh.gov.br/sites/default/files/estrutura-de-governo/bhtrans/2019/documentos/itinerario.csv";
const pontos_url = "https://prefeitura.pbh.gov.br/sites/default/files/estrutura-de-governo/bhtrans/2019/documentos/ponto-itinerario-com-coordenadas-lat-long.csv";
const quadro_horario_url = "https://prefeitura.pbh.gov.br/sites/default/files/estrutura-de-governo/bhtrans/2019/documentos/quadro-horario.csv";
const tarifa_url = "https://prefeitura.pbh.gov.br/sites/default/files/estrutura-de-governo/bhtrans/2019/documentos/tarifa-linha.csv";

async function getCsvData(url:string) {
    return (await csvParser((await axios.default.get(url)).data, { separator: ';' }));
}

export async function teste() {
    console.log(await getCsvData(pontos_url));
}
