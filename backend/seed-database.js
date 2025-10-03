require('dotenv').config();
const mongoose = require('mongoose');
const Asteroid = require('./models/Asteroid');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/asteroid-dashboard';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully. Starting database seeding...');
    seedDatabase();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const seedDatabase = async () => {
    try {
        await Asteroid.deleteMany({});
        console.log('Existing asteroid data cleared.');

        const asteroidData = [
            // 2015 (6 impacts)
            { name: '2015-A1', impactDate: new Date('2015-02-10'), impactLocation: { country: 'Australia', latitude: -25.27, longitude: 133.77 } },
            { name: '2015-B1', impactDate: new Date('2015-04-15'), impactLocation: { country: 'USA', latitude: 39.82, longitude: -98.57 } },
            { name: '2015-C1', impactDate: new Date('2015-07-25'), impactLocation: { country: 'Russia', latitude: 61.52, longitude: 105.32 } },
            { name: '2015-D1', impactDate: new Date('2015-09-12'), impactLocation: { country: 'Brazil', latitude: -14.23, longitude: -51.92 } },
            { name: '2015-E1', impactDate: new Date('2015-11-20'), impactLocation: { country: 'India', latitude: 20.59, longitude: 78.96 } },
            { name: '2015-F1', impactDate: new Date('2015-12-05'), impactLocation: { country: 'China', latitude: 35.86, longitude: 104.19 } },

            // 2016 (5 impacts)
            { name: '2016-A1', impactDate: new Date('2016-01-18'), impactLocation: { country: 'Canada', latitude: 56.13, longitude: -106.34 } },
            { name: '2016-B1', impactDate: new Date('2016-04-05'), impactLocation: { country: 'Russia', latitude: 55.75, longitude: 37.61 } },
            { name: '2016-C1', impactDate: new Date('2016-06-22'), impactLocation: { country: 'USA', latitude: 37.09, longitude: -95.71 } },
            { name: '2016-D1', impactDate: new Date('2016-08-15'), impactLocation: { country: 'Australia', latitude: -30.00, longitude: 140.00 } },
            { name: '2016-E1', impactDate: new Date('2016-11-30'), impactLocation: { country: 'Japan', latitude: 36.20, longitude: 138.25 } },

            // 2017 (7 impacts)
            { name: '2017-A1', impactDate: new Date('2017-01-18'), impactLocation: { country: 'China', latitude: 30.00, longitude: 100.00 } },
            { name: '2017-B1', impactDate: new Date('2017-03-08'), impactLocation: { country: 'India', latitude: 22.00, longitude: 80.00 } },
            { name: '2017-C1', impactDate: new Date('2017-05-20'), impactLocation: { country: 'USA', latitude: 40.00, longitude: -105.00 } },
            { name: '2017-D1', impactDate: new Date('2017-07-14'), impactLocation: { country: 'Russia', latitude: 50.00, longitude: 80.00 } },
            { name: '2017-E1', impactDate: new Date('2017-09-30'), impactLocation: { country: 'Brazil', latitude: -23.5, longitude: -46.6 } },
            { name: '2017-F1', impactDate: new Date('2017-11-15'), impactLocation: { country: 'Canada', latitude: 45.42, longitude: -75.69 } },
            { name: '2017-G1', impactDate: new Date('2017-12-25'), impactLocation: { country: 'Australia', latitude: -27.00, longitude: 135.00 } },

            // 2018 (6 impacts)
            { name: '2018-A1', impactDate: new Date('2018-02-14'), impactLocation: { country: 'Japan', latitude: 34.00, longitude: 135.00 } },
            { name: '2018-B1', impactDate: new Date('2018-04-01'), impactLocation: { country: 'USA', latitude: 35.00, longitude: -100.00 } },
            { name: '2018-C1', impactDate: new Date('2018-06-18'), impactLocation: { country: 'Russia', latitude: 55.75, longitude: 37.61 } },
            { name: '2018-D1', impactDate: new Date('2018-08-22'), impactLocation: { country: 'China', latitude: 31.00, longitude: 102.00 } },
            { name: '2018-E1', impactDate: new Date('2018-10-10'), impactLocation: { country: 'India', latitude: 28.6, longitude: 77.2 } },
            { name: '2018-F1', impactDate: new Date('2018-12-05'), impactLocation: { country: 'Peru', latitude: -10.00, longitude: -75.00 } },

            // 2019 (8 impacts) - Peak year
            { name: '2019-A1', impactDate: new Date('2019-01-10'), impactLocation: { country: 'USA', latitude: 38.90, longitude: -77.03 } },
            { name: '2019-B1', impactDate: new Date('2019-03-25'), impactLocation: { country: 'Russia', latitude: 61.52, longitude: 105.32 } },
            { name: '2019-C1', impactDate: new Date('2019-05-12'), impactLocation: { country: 'Australia', latitude: -25.27, longitude: 133.77 } },
            { name: '2019-D1', impactDate: new Date('2019-06-30'), impactLocation: { country: 'China', latitude: 35.86, longitude: 104.19 } },
            { name: '2019-E1', impactDate: new Date('2019-08-15'), impactLocation: { country: 'India', latitude: 20.59, longitude: 78.96 } },
            { name: '2019-F1', impactDate: new Date('2019-09-25'), impactLocation: { country: 'Brazil', latitude: -14.23, longitude: -51.92 } },
            { name: '2019-G1', impactDate: new Date('2019-11-11'), impactLocation: { country: 'Canada', latitude: 56.13, longitude: -106.34 } },
            { name: '2019-H1', impactDate: new Date('2019-12-20'), impactLocation: { country: 'Japan', latitude: 36.20, longitude: 138.25 } },

            // 2020 (7 impacts)
            { name: '2020-A1', impactDate: new Date('2020-01-20'), impactLocation: { country: 'USA', latitude: 42.00, longitude: -80.00 } },
            { name: '2020-B1', impactDate: new Date('2020-03-05'), impactLocation: { country: 'Russia', latitude: 50.00, longitude: 80.00 } },
            { name: '2020-C1', impactDate: new Date('2020-05-18'), impactLocation: { country: 'China', latitude: 30.00, longitude: 100.00 } },
            { name: '2020-D1', impactDate: new Date('2020-07-28'), impactLocation: { country: 'Australia', latitude: -30.00, longitude: 140.00 } },
            { name: '2020-E1', impactDate: new Date('2020-09-10'), impactLocation: { country: 'India', latitude: 22.00, longitude: 80.00 } },
            { name: '2020-F1', impactDate: new Date('2020-11-01'), impactLocation: { country: 'Brazil', latitude: -23.5, longitude: -46.6 } },
            { name: '2020-G1', impactDate: new Date('2020-12-15'), impactLocation: { country: 'Peru', latitude: -12.04, longitude: -77.03 } },

            // 2021 (5 impacts)
            { name: '2021-A1', impactDate: new Date('2021-02-28'), impactLocation: { country: 'USA', latitude: 35.00, longitude: -100.00 } },
            { name: '2021-B1', impactDate: new Date('2021-04-28'), impactLocation: { country: 'Russia', latitude: 55.75, longitude: 37.61 } },
            { name: '2021-C1', impactDate: new Date('2021-07-15'), impactLocation: { country: 'China', latitude: 31.00, longitude: 102.00 } },
            { name: '2021-D1', impactDate: new Date('2021-09-10'), impactLocation: { country: 'India', latitude: 28.6, longitude: 77.2 } },
            { name: '2021-E1', impactDate: new Date('2021-12-05'), impactLocation: { country: 'Japan', latitude: 34.00, longitude: 135.00 } },

            // 2022 (6 impacts)
            { name: '2022-A1', impactDate: new Date('2022-01-22'), impactLocation: { country: 'Australia', latitude: -27.00, longitude: 135.00 } },
            { name: '2022-B1', impactDate: new Date('2022-03-15'), impactLocation: { country: 'USA', latitude: 39.82, longitude: -98.57 } },
            { name: '2022-C1', impactDate: new Date('2022-05-07'), impactLocation: { country: 'Russia', latitude: 61.52, longitude: 105.32 } },
            { name: '2022-D1', impactDate: new Date('2022-07-07'), impactLocation: { country: 'China', latitude: 35.86, longitude: 104.19 } },
            { name: '2022-E1', impactDate: new Date('2022-09-22'), impactLocation: { country: 'Brazil', latitude: -14.23, longitude: -51.92 } },
            { name: '2022-F1', impactDate: new Date('2022-12-05'), impactLocation: { country: 'Canada', latitude: 45.42, longitude: -75.69 } },

            // 2023 (4 impacts)
            { name: '2023-A1', impactDate: new Date('2023-03-10'), impactLocation: { country: 'India', latitude: 20.59, longitude: 78.96 } },
            { name: '2023-B1', impactDate: new Date('2023-06-15'), impactLocation: { country: 'USA', latitude: 37.09, longitude: -95.71 } },
            { name: '2023-C1', impactDate: new Date('2023-09-05'), impactLocation: { country: 'Russia', latitude: 50.00, longitude: 80.00 } },
            { name: '2023-D1', impactDate: new Date('2023-11-20'), impactLocation: { country: 'Australia', latitude: -30.00, longitude: 140.00 } },

            // 2024 (5 impacts)
            { name: '2024-A1', impactDate: new Date('2024-01-14'), impactLocation: { country: 'China', latitude: 30.00, longitude: 100.00 } },
            { name: '2024-B1', impactDate: new Date('2024-04-20'), impactLocation: { country: 'Japan', latitude: 36.20, longitude: 138.25 } },
            { name: '2024-C1', impactDate: new Date('2024-07-11'), impactLocation: { country: 'USA', latitude: 40.00, longitude: -105.00 } },
            { name: '2024-D1', impactDate: new Date('2024-09-01'), impactLocation: { country: 'Brazil', latitude: -23.5, longitude: -46.6 } },
            { name: '2024-E1', impactDate: new Date('2024-11-15'), impactLocation: { country: 'India', latitude: 22.00, longitude: 80.00 } },

            // 2025 (3 impacts)
            { name: '2025-A1', impactDate: new Date('2025-02-28'), impactLocation: { country: 'Russia', latitude: 55.75, longitude: 37.61 } },
            { name: '2025-B1', impactDate: new Date('2025-05-15'), impactLocation: { country: 'Australia', latitude: -25.27, longitude: 133.77 } },
            { name: '2025-C1', impactDate: new Date('2025-08-10'), impactLocation: { country: 'USA', latitude: 38.90, longitude: -77.03 } },
        ];

        await Asteroid.insertMany(asteroidData);
        console.log(`Database seeded with ${asteroidData.length} asteroid impacts.`);
        
        // Verify the data
        const count = await Asteroid.countDocuments();
        console.log(`Total documents in database: ${count}`);
        
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    } catch (err) {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    }
};