const rp = require('request-promise');
const AREAS = require('./res/areas');
const pokedex = require('./res/pokemon');

const scan = (area) => {
    const endpoint = `https://pokevision.com/map/data/${area.lat}/${area.lng}`;
    return rp.get(endpoint)
    .then(res => {
        return { payload: res, area: area.name };
    })
    .catch(err => err);
};

const checkPokedex = (search) => {
    return JSON.parse(search.payload).pokemon
    .map(p => `${pokedex(p.pokemonId)} near ${search.area}!`);
};

const findPokemon = () => {
    let promises = AREAS.map(area => {
        console.log(area.name);
        return scan(area);
    });
    return Promise.all(promises)
    .then(result => {
        const allNearby = result.map(res => checkPokedex(res));
        console.log(allNearby);
    })
    .catch(err => {
        console.log('error finding pokemon! ', err);
    });
};

findPokemon();
