const Genres = require('../schemas/genre');

class Genre {

    constructor(name) {

        this.name = name;
    }

    
    async createGenre() {

        try {

            const genre = new Genres({

                name: 'Marv',
            });
            
            const result = await genre.save(); 
            
            console.log(result);
            
        } catch (error) {
            console.error(error.message);
        }
    }
}

module.exports = Genre;