const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true } )
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Cant connect to mongoDb', err)); 

const courseSchema = new mongoose.Schema({
    
    name: { 
        type: String, 
        required: true,
        minLength: 5,
        maxlength: 255
        //match: /Pattern

    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,
    tags: {               //custom validator with msg
        type: Array,
        validate: {
            isAsync: true,                       //async validator
            validator: function(value, callback) {
                // Do some async work
                setTimeout(() => {
                    const result = value && value.length > 0;
                    callback(result);
                    

                }, 4000)

            },

            message: 'A course should have at least one tags'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished },
        min: 10,
        max: 300
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {

    try {

        const course = new Course({

            name: 'Marv',
            category: 'web',
            author: 'Powel',
            tags: null,
            isPublished: true,
            price: 200
        });
        
        const result = await course.save();  //course.validate();
        
        console.log(result);
        
    } catch (error) {
        console.error(error.message);
    }
}
createCourse();