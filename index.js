const rp = require('request-promise');
const AREAS = require('./res/areas');
const pokedex = require('./res/pokemon').uncaught;

const scan = (area) => {
    const endpoint = `https://pokevision.com/map/data/${area.lat}/${area.lng}`;
    return rp.get(endpoint)
    .then(res => {
        return { payload: res, area: area.name };
    })
    .catch(err => err);
};

const checkPokedex = (search) => {
    let target, found = [];
    JSON.parse(search.payload).pokemon
    .forEach(p => {
        target = pokedex(p.pokemonId);
        if (target) found.push(`${target} near ${search.area}!`);
    });
    return found;
};

const findPokemon = () => {
    let promises = AREAS.map(area => {
        return scan(area);
    });
    return Promise.all(promises)
    .then(result => {
        const allNearby = result.map(res => checkPokedex(res));
        console.log(allNearby.length ? allNearby : 'no uncaught pokemon in the area');
    })
    .catch(err => {
        console.log('error finding pokemon! ', err);
    });
};

findPokemon();
