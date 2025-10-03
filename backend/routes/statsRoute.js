const express = require('express');
const router = express.Router();
const Asteroid = require('../models/Asteroid');

router.get('/', async (req, res) => {
    try {
        console.log('Fetching asteroid statistics for 2015-2025...');
        
        // Date range for past 10 years (2015-2025)
        const startDate = new Date('2015-01-01');
        const endDate = new Date('2025-12-31');

        // Fetch asteroids from the database
        const asteroids = await Asteroid.find({
            'impactDate': { 
                $gte: startDate,
                $lte: endDate
            }
        });

        console.log(`Found ${asteroids.length} asteroids between 2015-2025`);

        // Initialize statistics
        const stats = {
            totalImpacts: asteroids.length,
            impactsOverTime: {},
            impactsByCountry: {},
            yearWithMostImpacts: { year: null, count: 0 }
        };

        // Process each asteroid
        asteroids.forEach(asteroid => {
            const year = asteroid.impactDate.getFullYear();
            const country = asteroid.impactLocation.country;

            // Count by year
            stats.impactsOverTime[year] = (stats.impactsOverTime[year] || 0) + 1;

            // Count by country
            stats.impactsByCountry[country] = (stats.impactsByCountry[country] || 0) + 1;

            // Track year with most impacts
            if (stats.impactsOverTime[year] > stats.yearWithMostImpacts.count) {
                stats.yearWithMostImpacts.year = year;
                stats.yearWithMostImpacts.count = stats.impactsOverTime[year];
            }
        });

        // Ensure we have data for all years 2015-2025
        for (let year = 2015; year <= 2025; year++) {
            if (!stats.impactsOverTime[year]) {
                stats.impactsOverTime[year] = 0;
            }
        }

        // Sort years
        const sortedImpactsOverTime = {};
        Object.keys(stats.impactsOverTime)
            .sort()
            .forEach(year => {
                sortedImpactsOverTime[year] = stats.impactsOverTime[year];
            });
        stats.impactsOverTime = sortedImpactsOverTime;

        console.log('Final statistics:', stats);
        
        res.json(stats);
    } catch (err) {
        console.error('Error in stats route:', err);
        res.status(500).json({ 
            message: 'Server error while fetching statistics.',
            error: err.message 
        });
    }
});

module.exports = router;