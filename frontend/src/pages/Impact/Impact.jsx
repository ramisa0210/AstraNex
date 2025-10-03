import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { jsPDF } from "jspdf";

const AsteroidSimulator = () => {
    // State variables for simulation parameters
    const [asteroidSize, setAsteroidSize] = useState(null); // in meters
    const [impactAngle, setImpactAngle] = useState(null); // in degrees
    const [velocity, setVelocity] = useState(null); // in km/s
    const [materialComposition, setMaterialComposition] = useState("");
    const [targetLocation, setTargetLocation] = useState("");
    const [selectedAsteroid, setSelectedAsteroid] = useState(null);
    const [simulationStatus, setSimulationStatus] = useState("UNCONFIGURED");
    const [deflectionStrategy, setDeflectionStrategy] = useState("kinetic");
    const [timeBeforeImpact, setTimeBeforeImpact] = useState(500); // in days
    const [impactorMass, setImpactorMass] = useState(1000); // in kg
    const [showMitigationPanel, setShowMitigationPanel] = useState(false);
    const [deflectionSuccess, setDeflectionSuccess] = useState(null);
    
    // State to hold an array of ALL failed strategies for display
    const [failedStrategies, setFailedStrategies] = useState([]); 
    
    // State variables for simulation results
    const [kineticEnergy, setKineticEnergy] = useState(0);
    const [craterDiameter, setCraterDiameter] = useState(0);
    const [shockwaveRadius, setShockwaveRadius] = useState(0);
    const [predictedFatalities, setPredictedFatalities] = useState(0);
    const [riskLevel, setRiskLevel] = useState("");
    const [locationSpecificMetrics, setLocationSpecificMetrics] = useState({});
    
    // State for structured Evacuation Plan Data
    const [evacuationPlanData, setEvacuationPlanData] = useState(null); 
    const [fatalitiesMitigated, setFatalitiesMitigated] = useState(0);

    // State for visualization elements
    const [showIncomingPath, setShowIncomingPath] = useState(false);
    const [showDeflectionPath, setShowDeflectionPath] = useState(false);

    // Reference for the globe element
    const globeRef = useRef(null);

    // Data for known asteroids
    const knownAsteroids = [
        { id: "bennu", name: "Bennu", diameter: 490, velocity: 12.4, material: "Carbonaceous" },
        { id: "apophis", name: "Apophis", diameter: 370, velocity: 17.2, material: "Stony" },
        { id: "ryugu", name: "Ryugu", diameter: 900, velocity: 14.3, material: "Carbonaceous" },
        { id: "ceres", name: "Ceres", diameter: 940, velocity: 8.5, material: "Stony" },
        { id: "vesta", name: "Vesta", diameter: 525, velocity: 9.2, material: "Stony" },
        { id: "pallas", name: "Pallas", diameter: 512, velocity: 10.8, material: "Stony" },
        { id: "hygiea", name: "Hygiea", diameter: 430, velocity: 7.5, material: "Carbonaceous" },
        { id: "eros", name: "Eros", diameter: 33, velocity: 15.3, material: "Stony" },
        { id: "custom", name: "Custom", diameter: 500, velocity: 17, material: "Iron-Nickel" }
    ];

    // Data for other options
    const materialOptions = ["Iron-Nickel", "Stony", "Carbonaceous", "Ice", "Mixed"];
    const locationOptions = ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Bay of Bengal", "North America", "Europe", "Asia", "Africa", "Australia", "Arctic Ocean", "South America"];
    
    // Mitigation Strategies (Ion Beam removed)
    const mitigationStrategies = [
        { id: "kinetic", name: "Kinetic Impactor", icon: "🚀" },
        { id: "tractor", name: "Gravity Tractor", icon: "🛰" },
        { id: "nuclear", name: "Nuclear Disruption", icon: "⚛️" },
    ];

    // Function to calculate impact effects
    const calculateImpactEffects = (size, angle, speed, material, location) => {
        if (size === null || angle === null || speed === null || material === "" || location === "") return;
        
        const density = material === "Iron-Nickel" ? 8000 : material === "Stony" ? 3000 : 2000;
        const mass = (4 / 3) * Math.PI * Math.pow(size / 2, 3) * density;
        const energyJoules = 0.5 * mass * Math.pow(speed * 1000, 2);
        const energyMegatons = energyJoules / (4.184 * Math.pow(10, 15));

        const craterSize = 0.07 * Math.pow(energyMegatons, 0.294) * (angle / 45);
        const blastRadius = 16.5 * Math.pow(energyMegatons, 0.4) * Math.sin(angle * Math.PI / 180);
        
        let fatalitiesMultiplier = 1.5; 
        if (location.includes("Ocean")) fatalitiesMultiplier = 0.3; 
        if (location === "Bay of Bengal") fatalitiesMultiplier = 2.0; 

        const fatalities = (energyMegatons * 200) * fatalitiesMultiplier; 

        setKineticEnergy(Math.round(energyMegatons));
        setCraterDiameter(craterSize.toFixed(2));
        setShockwaveRadius(Math.round(blastRadius));
        setPredictedFatalities((fatalities / 1000000).toFixed(2));
        setFatalitiesMitigated(0);

        let calculatedRisk = "LOW";
        if (energyMegatons > 10000) calculatedRisk = "CRITICAL";
        else if (energyMegatons > 1000) calculatedRisk = "HIGH";
        else if (energyMegatons > 100) calculatedRisk = "MEDIUM";
        
        setRiskLevel(calculatedRisk);

        generateLocationSpecificMetrics(location);
    };

    // Function to determine and set location-specific metrics
    const generateLocationSpecificMetrics = (location) => {
         if (location.includes("Ocean") && location !== "Bay of Bengal") {
            setLocationSpecificMetrics({
                "Tsunami Height": "50m",
                "Coastal Cities at Risk": "15",
                "Coastal Population Affected": "25 Million",
                "Port Infrastructure Damage": "$500B"
            });
        } else if (location === "Bay of Bengal") {
             setLocationSpecificMetrics({
                "Tsunami Height": "80m",
                "Affected Countries": "Bangladesh, India, Sri Lanka",
                "Population at High Risk": "50 Million",
                "Evac. Complexity": "EXTREME"
            });
        } else if (location.includes("Arctic") || location.includes("Antarctica")) {
            setLocationSpecificMetrics({
                "Ice Melt Volume": "5000 km³",
                "Sea Level Rise": "0.5cm",
                "Global Temperature Change": "+0.3°C",
                "Ecosystem Impact": "SEVERE"
            });
        } else {
            setLocationSpecificMetrics({
                "Crater Diameter": "8km",
                "Immediate Blast Radius": "50km",
                "Population at Risk": "10.2 Million",
                "Affected Major Cities": "Dhaka, Delhi, Kolkata", // Added Dhaka for context
                "Agricultural Land Destroyed": "20,000 km²"
            });
        }
    };
    
    // Generic handler for parameter changes
    const handleParameterChange = (setter, value) => {
        setter(value);
        if (simulationStatus !== "UNCONFIGURED") {
             setSimulationStatus("IDLE");
        }
    }


    // Event handler for asteroid selection
    const handleAsteroidSelect = (asteroidId) => {
        const asteroid = knownAsteroids.find(a => a.id === asteroidId);
        
        if (asteroid) {
            setSelectedAsteroid(asteroidId);
            setAsteroidSize(asteroid.diameter);
            setVelocity(asteroid.velocity);
            setMaterialComposition(asteroid.material);
            setImpactAngle(45);
            setTargetLocation("Bay of Bengal");
            setSimulationStatus("IDLE");
            setShowIncomingPath(true);
            setShowDeflectionPath(false);
            setDeflectionSuccess(null);
            setEvacuationPlanData(null);
            setFailedStrategies([]); 
            setRiskLevel("");
        }
    };

    // Event handler for running the simulation
    const handleRunSimulation = () => {
        if (asteroidSize === null || impactAngle === null || velocity === null || materialComposition === "" || targetLocation === "") {
             alert("Please select or set all asteroid parameters before running the simulation.");
             return;
        }
        
        calculateImpactEffects(asteroidSize, impactAngle, velocity, materialComposition, targetLocation);
        
        setSimulationStatus("IMPACT");
        setShowIncomingPath(false);
        setDeflectionSuccess(null);
        setEvacuationPlanData(null);
        setFailedStrategies([]); 
    };

    
    const handleRunDeflection = () => {
        setSimulationStatus("DEFLECTING");
        
        // Define failure criteria for various strategies
        const failureChecks = [];
        
        
        // Fails if less than 5 days (too close)
        if (timeBeforeImpact < 5) { 
            failureChecks.push({id: 'kinetic', reason: "IMPOSSIBLE DEADLINE (Too close to impact)"});
        } 
        // Also fails if selected and mass is insufficient for a large asteroid (size > 1000m)
        else if (deflectionStrategy === 'kinetic' && asteroidSize > 1000 && impactorMass < 5000) {
             failureChecks.push({id: 'kinetic', reason: "INSUFFICIENT MASS (Impactor too light for large object)"});
        }
        
        // --- 2. Gravity Tractor Failure ---
        if (timeBeforeImpact < 365 * 3) { // Tractors need years, fail if less than 3 years
             failureChecks.push({id: 'tractor', reason: "INSUFFICIENT TIME (Cannot achieve necessary thrust over time)"});
        }
        
        // --- 3. Nuclear Failure ---
        if (asteroidSize < 500) { 
             failureChecks.push({id: 'nuclear', reason: "HIGH FRAGMENTATION RISK (Creating multiple threats)"});
        }

        // --- Determine Final Success/Failure ---
        let isSuccessful = failureChecks.length === 0;
        
        // If the chosen strategy failed its check, it's a definite failure
        const attemptedStrategyFailed = failureChecks.some(f => f.id === deflectionStrategy);
        if (attemptedStrategyFailed) {
            isSuccessful = false;
        } else {
             // For successful strategy checks, use a probability based on time
             const baseSuccessChance = timeBeforeImpact > 365 ? 0.8 : timeBeforeImpact > 30 ? 0.6 : 0.2;
             isSuccessful = Math.random() < baseSuccessChance;
        }

        setTimeout(() => {
            setDeflectionSuccess(isSuccessful);
            
            if (isSuccessful) {
                setRiskLevel("SAFE"); 
                setSimulationStatus("SUCCESS");
                setShowDeflectionPath(true);
                setFailedStrategies([]);
            } else {
                 // --- SIMULATE TRIPLE FAILURE FOR EVACUATION TRIGGER ---
                 
                 // Get the specific failure reason for the attempted strategy (or a generic one)
                 const attemptedFailure = failureChecks.find(f => f.id === deflectionStrategy) || 
                                           {id: deflectionStrategy, reason: "MISSION CRITICAL FAILURE (Impulse/Timing Mismatch)"};
                 
                 // Compile the list of all other known failures
                 const allKnownFailures = failureChecks.filter(f => f.id !== attemptedFailure.id);
                 
                 // Fill the list up to the 3 main strategies (Kinetic, Tractor, Nuclear) 
                 const simulatedFailures = [];
                 
                 // Check if Kinetic Impactor was the attempted failure. If not, simulate its failure.
                 if (attemptedFailure.id !== 'kinetic') {
                     simulatedFailures.push(allKnownFailures.find(f => f.id === 'kinetic') || { id: 'kinetic', reason: "INSUFFICIENT MASS"});
                 }
                 // Check if Gravity Tractor was the attempted failure. If not, simulate its failure.
                 if (attemptedFailure.id !== 'tractor') {
                     simulatedFailures.push(allKnownFailures.find(f => f.id === 'tractor') || { id: 'tractor', reason: "INSUFFICIENT TIME"});
                 }
                 // Check if Nuclear Disruption was the attempted failure. If not, simulate its failure.
                 if (attemptedFailure.id !== 'nuclear') {
                      const nuclearFail = allKnownFailures.find(f => f.id === 'nuclear');
                      if(nuclearFail) {
                          simulatedFailures.push(nuclearFail);
                      } else if (!simulatedFailures.some(f => f.id === 'nuclear')) {
                          simulatedFailures.push({ id: 'nuclear', reason: "HIGH FRAGMENTATION RISK"});
                      }
                 }
                 
                 // Combine the attempted failure with the two other simulated/known failures.
                 const finalFailures = [attemptedFailure, ...simulatedFailures]
                    .filter((f, index, self) => index === self.findIndex((t) => t.id === f.id && (t.id === 'kinetic' || t.id === 'tractor' || t.id === 'nuclear')))
                    .slice(0, 3);
                 
                 setFailedStrategies(finalFailures);
                 
                 // Deflection failed, proceed to Evacuation phase
                 calculateImpactEffects(asteroidSize, impactAngle, velocity, materialComposition, targetLocation);
                 setSimulationStatus("EVACUATION_PENDING");
                 
                 // Generate structured evacuation plan immediately upon failure
                 const plan = generateEvacuationPlan(targetLocation, predictedFatalities, timeBeforeImpact);
                 setEvacuationPlanData(plan);
            }
            setShowMitigationPanel(false);
        }, 1500); 
    };

    /**
     * Function to generate Structured Evacuation Plan with multiple scenarios
     */
    const generateEvacuationPlan = (location, predictedFatalities, time) => {
        const totalPopulation = parseFloat(predictedFatalities) * 1000000;
        const timeAvailable = Math.max(72, Math.round(time * 24 * 0.5)); // Time available in hours, minimum 72hrs
        const totalPopulationMillions = (totalPopulation / 1000000).toFixed(1);
        
        let zones = [];
        let locationName;
        let popTotal = 0;

        if (location === "Bay of Bengal") {
            locationName = "Bay of Bengal (Bangladesh/India Coastal)";
            // Distribution based on high coastal population
            zones = [
                { id: 1, name: "Dhaka & Near Coast (Highest Density)", factor: 0.25, time: 24, color: 'red' },
                { id: 2, name: "Coastal Districts (Chittagong/Khulna)", factor: 0.45, time: 48, color: 'orange' },
                { id: 3, name: "Inland Buffer Zones (Secondary Risk)", factor: 0.30, time: 72, color: 'yellow' }
            ];
        } else if (location === "North America") {
            locationName = "North American Interior (US/Canada)";
             zones = [
                { id: 1, name: "Ground Zero & Primary Blast Ring (50km)", factor: 0.15, time: 12, color: 'red' },
                { id: 2, name: "Thermal and Fire Risk Zone (200km)", factor: 0.45, time: 36, color: 'orange' },
                { id: 3, name: "Seismic/Air Shockwave Zone (500km)", factor: 0.40, time: 60, color: 'yellow' }
            ];
        } else if (location === "Europe") {
             locationName = "Western Europe (High Density)";
             zones = [
                { id: 1, name: "Immediate Impact Crater Zone", factor: 0.20, time: 18, color: 'red' },
                { id: 2, name: "Major Urban Centers Proximity", factor: 0.50, time: 48, color: 'orange' },
                { id: 3, name: "Contiguous Land Mass Risk Zones", factor: 0.30, time: 72, color: 'yellow' }
            ];
        } else {
             // Generic Land Impact
             locationName = location + " (General Land Impact)";
             zones = [
                { id: 1, name: "Ground Zero Ring", factor: 0.1, time: 24, color: 'red' },
                { id: 2, name: "Primary Risk Buffer (Shockwave)", factor: 0.4, time: 48, color: 'orange' },
                { id: 3, name: "Secondary Risk Buffer (Seismic/Fallout)", factor: 0.5, time: 72, color: 'yellow' }
            ];
        }
        
        // Calculate population for each zone
        const finalZones = zones.map(zone => {
             const population = Math.round(totalPopulation * zone.factor);
             popTotal += population;
             return { ...zone, population: population };
        });

        return {
            location: locationName,
            timeAvailable: timeAvailable,
            totalPopulation: (popTotal / 1000000).toFixed(1),
            zones: finalZones.filter(z => z.population > 0)
        };
    };


    // Evacuation Handler 
    const handleRunEvacuation = () => {
        setEvacuationPlanData(null); // Close the modal
        setSimulationStatus("EVACUATING");

        const baselineFatalities = parseFloat(predictedFatalities);
        let mitigationPercent = 0.0; 
        
        // Mitigation calculation remains the same
        if (baselineFatalities < 1) { 
            mitigationPercent = 0.5 + (Math.random() * 0.3); 
        } else if (baselineFatalities >= 1 && baselineFatalities < 5) { 
            mitigationPercent = 0.2 + (Math.random() * 0.3); 
        } else { 
            mitigationPercent = 0.05 + (Math.random() * 0.1); 
        }

        const mitigated = (baselineFatalities * mitigationPercent).toFixed(2);
        const finalFatalities = (baselineFatalities - mitigated).toFixed(2);
        
        setTimeout(() => {
            setPredictedFatalities(finalFatalities);
            setFatalitiesMitigated(mitigated);
            setSimulationStatus("IMPACT_AFTER_EVAC");
        }, 2000);
    }


    // Event handler for resetting the simulation
    const resetSimulation = () => {
        setSelectedAsteroid(null);
        setAsteroidSize(null); 
        setImpactAngle(null);
        setVelocity(null);
        setMaterialComposition("");
        setTargetLocation("");

        setKineticEnergy(0);
        setCraterDiameter(0);
        setShockwaveRadius(0);
        setPredictedFatalities(0);
        setRiskLevel("");
        setLocationSpecificMetrics({});
        setFatalitiesMitigated(0);

        setSimulationStatus("UNCONFIGURED");
        setDeflectionSuccess(null);
        setShowMitigationPanel(false);
        setEvacuationPlanData(null);
        setFailedStrategies([]);
        setShowIncomingPath(false);
        setShowDeflectionPath(false);
    };

    // PDF Report Logic (Corrected and updated for Evacuation Plan)
    const generatePDFReport = () => {
        if (simulationStatus === "UNCONFIGURED" || riskLevel === "") return;
        
        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 20;
        let y = margin;
        const lineHeight = 8;
        const width = 210;
        const knownAsteroid = knownAsteroids.find(a => a.id === selectedAsteroid);
        const asteroidNameForReport = knownAsteroid ? knownAsteroid.name : 'Custom Asteroid';
        const currentStrategy = mitigationStrategies.find(s => s.id === deflectionStrategy);

        // --- 1. Header ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(33, 150, 243);
        doc.text('ASTRA-NEX THREAT ASSESSMENT REPORT', width / 2, y, { align: 'center' });
        y += lineHeight * 3;
        
        // --- 2. EXECUTIVE SUMMARY ---
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('1. EXECUTIVE SUMMARY', margin, y);
        y += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Asteroid Name: ${asteroidNameForReport}`, margin, y); y += lineHeight;
        doc.text(`Impact Location: ${targetLocation}`, margin, y); y += lineHeight;
        doc.text(`Risk Level Assessment: ${riskLevel}`, margin, y); y += lineHeight * 1.5;
        
        // --- 3. IMPACT ANALYSIS ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('2. IMPACT ANALYSIS', margin, y);
        y += lineHeight;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`- Kinetic Energy: ${kineticEnergy.toLocaleString()} Megatons`, margin, y); y += lineHeight;
        
        // Conditional Fatalities Display
        if (simulationStatus === "IMPACT_AFTER_EVAC") {
             doc.text(`- Post-Evacuation Fatalities: ${predictedFatalities} Million (Est.)`, margin, y); y += lineHeight;
             doc.text(`  (Mitigated Fatalities: ${fatalitiesMitigated} Million)`, margin, y); y += lineHeight;
        } else {
             doc.text(`- Predicted Fatalities: ${predictedFatalities} Million (Est.)`, margin, y); y += lineHeight;
        }
        
        doc.text(`- Crater Diameter: ${craterDiameter} km`, margin, y); y += lineHeight;
        doc.text(`- Shockwave Radius: ${shockwaveRadius} km`, margin, y); y += lineHeight * 1.5;

        // --- 4. DEFENSE AND EVACUATION ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('3. DEFENSE AND EVACUATION', margin, y);
        y += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        if (deflectionSuccess === true) {
            doc.text(`- Defense Strategy: ${currentStrategy ? currentStrategy.name : 'Unknown'} - SUCCESSFUL`, margin, y); y += lineHeight;
            doc.text(`- Final Status: Threat neutralized. Begin recovery and long-term monitoring.`, margin, y); y += lineHeight * 2;
        } else if (deflectionSuccess === false) {
             doc.setFont('helvetica', 'bold');
             doc.setTextColor(200, 0, 0);
             doc.text(`- Defense Strategy Attempt: ${currentStrategy ? currentStrategy.name : 'Unknown'} - FAILED!`, margin, y); y += lineHeight;
             
             // List all failed strategies
             doc.text(`- Failed Strategies Summary:`, margin, y); y += lineHeight * 0.5;
             doc.setFont('helvetica', 'normal');
             failedStrategies.forEach(f => {
                 // Check for page break before adding more content
                 if (y > 270) { // Check if we are near the bottom of the page
                     doc.addPage();
                     y = margin;
                 }
                 doc.text(`  • ${mitigationStrategies.find(m => m.id === f.id)?.name || f.id}: ${f.reason}`, margin, y); y += lineHeight * 0.75;
             });

             doc.setTextColor(0, 0, 0);
             doc.setFont('helvetica', 'normal');
             y += lineHeight * 0.5;
             
             if (simulationStatus === "IMPACT_AFTER_EVAC") {
                 doc.setFont('helvetica', 'bold');
                 doc.setTextColor(63, 81, 181); // Darker Blue for Evac Success
                 doc.text(`- Civil Evacuation: ACTIVATED AND COMPLETED SUCCESSFULLY`, margin, y); y += lineHeight;
                 doc.setTextColor(0, 0, 0);
                 doc.setFont('helvetica', 'normal');
                 doc.text(`- Final Status: Impact occurred. Emergency response and aid deployment prioritized.`, margin, y); y += lineHeight * 2;
             } else {
                 doc.setFont('helvetica', 'bold');
                 doc.setTextColor(255, 133, 27);
                 doc.text(`- Immediate Action: ACTIVATE FULL CIVIL EVACUATION PROTOCOL.`, margin, y); y += lineHeight * 2;
             }
        } else {
            doc.text(`- Action: Threat detected. Initiate defense planning immediately.`, margin, y); y += lineHeight * 2;
        }
        
        // --- 5. EVACUATION PLAN SUMMARY (if failure leads to Evac) ---
        if (evacuationPlanData) {
             if (y > 250) {
                 doc.addPage();
                 y = margin;
             }
             
             doc.setFont('helvetica', 'bold');
             doc.setFontSize(16);
             doc.text('4. EVACUATION PLAN SUMMARY', margin, y);
             y += lineHeight;
             
             doc.setFont('helvetica', 'normal');
             doc.setFontSize(12);
             doc.text(`Target: ${evacuationPlanData.location} | Time Available: ${evacuationPlanData.timeAvailable} hrs`, margin, y); y += lineHeight;
             doc.text(`Total Population in Zones: ${evacuationPlanData.totalPopulation} Million`, margin, y); y += lineHeight;

             evacuationPlanData.zones.forEach(zone => {
                 if (y > 270) {
                     doc.addPage();
                     y = margin;
                 }

                 // Simplified color logic based on zone.color
                 const colorMap = {'red': [200, 0, 0], 'orange': [255, 133, 27], 'yellow': [255, 215, 0]};
                 const [r, g, b] = colorMap[zone.color] || [0, 0, 0];
                 doc.setTextColor(r, g, b);

                 doc.setFont('helvetica', 'bold');
                 doc.text(`Zone ${zone.id} (${zone.color.toUpperCase()}): ${zone.name}`, margin, y); y += lineHeight;
                 doc.setFont('helvetica', 'normal');
                 doc.text(`  - Population: ${(zone.population / 1000000).toFixed(1)} Million | Deadline: ${zone.time} hrs`, margin, y); y += lineHeight;
             });
             doc.setTextColor(0, 0, 0); // Reset color
             y += lineHeight * 0.5;
        }


        // Save the PDF
        doc.save(`AstraNex-Threat-Report-${asteroidNameForReport}-${riskLevel || 'NoData'}.pdf`);
    }

    // Check if all necessary parameters are set to enable the RUN button
    const canRunSimulation = selectedAsteroid !== null && targetLocation !== "" && asteroidSize !== null;
    
    // NEW: Static Evacuation Panel Component for the Impact Data Pane
    const EvacuationRequiredPanel = () => {
        return (
            <div className="evac-required-panel">
                <div className="evac-header">
                    <span className="evac-icon">🚨</span> 
                    <span className="evac-title">FULL CIVIL EVACUATION REQUIRED</span>
                </div>
                <div className="evac-separator"></div>
                <ul className="evac-list">
                    <li className="priority-red-item">
                        <span className="priority-label red-label">RED:</span>
                        <span className="priority-details">HIGH PRIORITY (24 hrs) - Dhaka District: 2.1M people</span>
                    </li>
                    <li className="priority-yellow-item">
                        <span className="priority-label yellow-label">YELLOW:</span>
                        <span className="priority-details">MEDIUM PRIORITY (48 hrs) - Coastal Areas: 4.8M people</span>
                    </li>
                    <li className="priority-green-item">
                        <span className="priority-label green-label">GREEN:</span>
                        <span className="priority-details">LOW PRIORITY (72 hrs) - Nearby Regions: 3.3M people</span>
                    </li>
                </ul>
            </div>
        );
    };


    // Evacuation Panel Component (Inline for Simplicity)
    const EvacuationPlanningPanel = () => {
        if (!evacuationPlanData) return null;

        return (
            <div className="mitigation-overlay" onClick={() => setEvacuationPlanData(null)}>
                <div className="mitigation-panel evacuation-modal" onClick={e => e.stopPropagation()}>
                    <div className="evac-header">
                        <div className="evac-title">🚨 AUTOMATIC EVACUATION PLANNING</div>
                        <div className="evac-separator"></div>
                    </div>
                    
                    <div className="evac-summary-grid">
                        <div className="summary-item">
                            <span className="summary-icon">📍</span>
                            <span className="summary-label">IMPACT ZONE:</span>
                            <span className="summary-value">{evacuationPlanData.location}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-icon">⏰</span>
                            <span className="summary-label">TIME AVAILABLE:</span>
                            <span className="summary-value">{evacuationPlanData.timeAvailable} hours</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-icon">👥</span>
                            <span className="summary-label">POPULATION AT RISK:</span>
                            <span className="summary-value">{evacuationPlanData.totalPopulation} Million</span>
                        </div>
                    </div>

                    <div className="evac-zone-list">
                        <div className="evac-title" style={{fontSize: '1.2rem', marginTop: '1rem', color: 'var(--text-color)'}}>PRIORITY EVACUATION ZONES</div>
                        <div className="evac-separator" style={{width: '90%', margin: '0.5rem auto 1.5rem auto'}}></div>

                        {evacuationPlanData.zones.map(zone => (
                            <div key={zone.id} className={`evac-zone-item zone-${zone.color}`}>
                                <div className="zone-indicator">ZONE {zone.id}</div>
                                <div className="zone-details">
                                    <div className="zone-name">
                                        <span className="zone-color-icon">
                                            {zone.color === 'red' ? '🔴' : zone.color === 'orange' ? '🟠' : '🟡'}
                                        </span>
                                        {zone.name} ({ (zone.population / 1000000).toFixed(1) }M)
                                    </div>
                                    <div className="zone-deadline">
                                        <span className="deadline-label">Evacuate within:</span> {zone.time} hours
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="confirm-btn red-confirm" onClick={handleRunEvacuation}>
                        INITIATE EVACUATION
                    </button>
                    
                </div>
            </div>
        );
    };

    // Main component render
    return (
        <div className="asteroid-simulator-container">

            <div className="main-title-bar">
                <h1 className="main-title">ASTEROID IMPACT SIMULATOR</h1>
                <p className="subtitle">NASA/JPL CNEOS Data Powered</p>
            </div>

            <div className="simulator-layout">
                {/* Left Panel - Control Panel */}
                <div className="control-panel panel">
                    <div className="panel-header">CONTROL PANEL</div>
                    <label className="input-label">Select Known Asteroid or 'Custom'</label>
                    <div className="asteroid-grid">
                        {knownAsteroids.map(asteroid => (
                            <button
                                key={asteroid.id}
                                className={`asteroid-btn ${selectedAsteroid === asteroid.id ? 'active' : ''}`}
                                onClick={() => handleAsteroidSelect(asteroid.id)}
                            >
                                {asteroid.name}
                            </button>
                        ))}
                    </div>

                    <div className="config-section">
                        <div className="slider-group">
                            <label className="input-label">Asteroid Size: {asteroidSize || 'N/A'}m</label>
                            <input
                                type="range" min="10" max="5000"
                                value={asteroidSize || 500} 
                                onChange={e => handleParameterChange(setAsteroidSize, e.target.value)}
                                className="slider"
                                disabled={selectedAsteroid === null}
                            />
                        </div>
                        <div className="slider-group">
                            <label className="input-label">Impact Angle: {impactAngle || 'N/A'}°</label>
                            <input
                                type="range" min="0" max="90"
                                value={impactAngle || 45} 
                                onChange={e => handleParameterChange(setImpactAngle, e.target.value)}
                                className="slider"
                                disabled={selectedAsteroid === null}
                            />
                        </div>
                        <div className="slider-group">
                            <label className="input-label">Velocity: {velocity || 'N/A'} km/s</label>
                            <input
                                type="range" min="1" max="70"
                                value={velocity || 17.0} 
                                onChange={e => handleParameterChange(setVelocity, e.target.value)}
                                className="slider"
                                disabled={selectedAsteroid === null}
                            />
                        </div>
                        <div className="select-group">
                            <label className="input-label">Material Composition</label>
                            <select
                                value={materialComposition}
                                onChange={e => handleParameterChange(setMaterialComposition, e.target.value)}
                                disabled={selectedAsteroid === null}
                            >
                                <option value="" disabled>Select Composition</option>
                                {materialOptions.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                            </select>
                        </div>
                        <div className="select-group">
                            <label className="input-label">Target Location</label>
                            <select
                                value={targetLocation}
                                onChange={e => handleParameterChange(setTargetLocation, e.target.value)}
                                disabled={selectedAsteroid === null}
                            >
                                <option value="" disabled>Select Location</option>
                                {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="run-btn"
                            onClick={handleRunSimulation}
                            disabled={!canRunSimulation || simulationStatus === "IMPACT" || simulationStatus === "SUCCESS" || simulationStatus === "EVACUATION_PENDING" || simulationStatus === "IMPACT_AFTER_EVAC"}
                        >
                            RUN SIMULATION
                        </button>
                        <button className="reset-btn" onClick={resetSimulation}>
                            RESET SIMULATION
                        </button>
                    </div>
                </div>

                {/* Center Panel - Simulation View */}
                <div className="simulation-view panel">
                    <div className="panel-header">{riskLevel || 'ASTRA-NEX VIEW'}</div>
                    <h3 className="sub-header">3D IMPACT VIEW</h3>
                    <div className="globe-container">
                        <div className="earth-globe" ref={globeRef}>
                            {/* NOTE: You need to have an Earth.jpg file in your public folder */}
                            <img src="/Earth.jpg" alt="Earth Globe" className="globe-texture" />

                            {showIncomingPath && (
                                <div className="incoming-path-container">
                                    <div className="incoming-path"></div>
                                    <div className="incoming-asteroid"></div>
                                </div>
                            )}

                            {showDeflectionPath && (
                                <div className="deflected-path-container">
                                    <div className="deflected-path"></div>
                                </div>
                            )}

                            {(simulationStatus === "IMPACT" || simulationStatus === "EVACUATION_PENDING" || simulationStatus === "IMPACT_AFTER_EVAC") && (
                                <div className="impact-zones-overlay">
                                    <div className="impact-zone-animated moderate-damage-zone">
                                        <span className="zone-label">MODERATE DAMAGE</span>
                                    </div>
                                    <div className="impact-zone-animated shockwave-zone">
                                        <span className="zone-label">SHOCKWAVE</span>
                                    </div>
                                    <div className="impact-zone-animated thermal-radius-zone">
                                        <span className="zone-label">THERMAL RADIUS</span>
                                    </div>
                                    <div className="impact-zone-animated blast-zone">
                                        <span className="zone-label">BLAST ZONE</span>
                                    </div>
                                    <div className="impact-zone-animated ground-zero-zone">
                                        <span className="zone-label">GROUND ZERO</span>
                                    </div>
                                    {(targetLocation.includes("Ocean") || targetLocation === "Bay of Bengal") && (
                                        <div className="impact-zone-animated tsunami-risk-zone">
                                            <span className="zone-label">TSUNAMI RISK ZONE</span>
                                        </div>
                                    )}
                                </div>
                            )}
                             {simulationStatus === "UNCONFIGURED" && (
                                <div className="unconfigured-overlay">
                                    <p>Select asteroid and target location to run simulation.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {simulationStatus !== "UNCONFIGURED" && (
                        <div className="impact-legend">
                            <div className="legend-item"><span className="legend-color moderate-damage-color"></span>MODERATE DAMAGE ({kineticEnergy}Mt)</div>
                            <div className="legend-item"><span className="legend-color shockwave-color"></span>SHOCKWAVE ({shockwaveRadius}km)</div>
                            <div className="legend-item"><span className="legend-color thermal-radius-color"></span>THERMAL RADIUS ({Math.round(craterDiameter * 10)}km)</div>
                            <div className="legend-item"><span className="legend-color blast-color"></span>BLAST ZONE ({craterDiameter}km)</div>
                            <div className="legend-item"><span className="legend-color ground-zero-color"></span>GROUND ZERO ({craterDiameter / 2}km)</div>
                            {(targetLocation.includes("Ocean") || targetLocation === "Bay of Bengal") && (
                                <div className="legend-item"><span className="legend-color tsunami-risk-color"></span>TSUNAMI RISK ZONE</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel - Impact Data */}
                <div className="impact-data panel">
                    <div className="panel-header">IMPACT DATA</div>
                    
                    {simulationStatus === "UNCONFIGURED" ? (
                        <div className="no-data-message">
                            <p>No Simulation Data. Please configure parameters and run simulation.</p>
                        </div>
                    ) : (
                        <>
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-value">{kineticEnergy.toLocaleString()} <span className="unit">Mt</span></div>
                                    <div className="metric-label">KINETIC ENERGY</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{predictedFatalities}M</div>
                                    <div className="metric-label">{simulationStatus === "IMPACT_AFTER_EVAC" ? 'POST-EVAC FATALITIES' : 'PREDICTED FATALITIES'}</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{shockwaveRadius} <span className="unit">km</span></div>
                                    <div className="metric-label">SHOCKWAVE RADIUS</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-value">{craterDiameter} <span className="unit">km</span></div>
                                    <div className="metric-label">CRATER DIAMETER</div>
                                </div>
                            </div>

                            {/* Status Box */}
                            <div className={`status-box ${riskLevel.toLowerCase()}`}>
                                <span className="status-label">
                                    STATUS: 
                                    {simulationStatus === "EVACUATION_PENDING" ? 'DEFENSE FAILED' : 
                                     simulationStatus === "IMPACT_AFTER_EVAC" ? 'IMPACT (EVAC COMPLETE)' : 
                                     simulationStatus} 
                                    | RISK: {riskLevel}
                                </span>
                            </div>

                            {/* --- NEW STATIC EVACUATION PANEL --- */}
                            {(simulationStatus === "EVACUATION_PENDING" || simulationStatus === "IMPACT_AFTER_EVAC") && (
                                <EvacuationRequiredPanel />
                            )}
                            {/* --- END NEW STATIC EVACUATION PANEL --- */}

                            <div className="atmospheric-entry-heat">
                                <div className="input-label">ATMOSPHERIC ENTRY HEAT</div>
                                <div className="heat-bar-container">
                                    <div className="heat-bar">
                                        <span className="heat-label safe">Safe</span>
                                        <span className="heat-label heating">Heating</span>
                                        <span className="heat-label breakup">Breakup</span>
                                        <div className="heat-indicator" style={{ width: `${(velocity / 70) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="location-specific-metrics">
                                <label className="input-label">LOCATION IMPACT OVERVIEW</label>
                                {Object.entries(locationSpecificMetrics).map(([label, value]) => (
                                    <div className="location-metric-item" key={label}>
                                        <span className="metric-label">{label}:</span>
                                        <span className="metric-value">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Mitigation Options - Deflection */}
                            {simulationStatus === "IMPACT" && (
                                <div className="mitigation-options">
                                    <div className="mitigation-label">Defense Simulator (Step 1/2)</div>
                                    <div className="strategy-buttons">
                                        {mitigationStrategies.map(strategy => (
                                            <button
                                                key={strategy.id}
                                                className={`strategy-btn ${deflectionStrategy === strategy.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setDeflectionStrategy(strategy.id);
                                                    setShowMitigationPanel(true);
                                                }}
                                            >
                                                <span className="strategy-icon">{strategy.icon}</span>
                                                <span className="strategy-name">{strategy.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evacuation Option - After Deflection Failure (Step 3) */}
                            {simulationStatus === "EVACUATION_PENDING" && (
                                <div className="mitigation-options">
                                    <div className="mitigation-label red-text">DEFENSE FAILED. ACTIVATE EVACUATION (Step 3)</div>
                                    <div className="strategy-buttons">
                                        <button
                                            className="strategy-btn red-background"
                                            onClick={() => {
                                                const plan = generateEvacuationPlan(targetLocation, predictedFatalities, timeBeforeImpact);
                                                setEvacuationPlanData(plan);
                                            }}
                                        >
                                            <span className="strategy-icon">⛑</span>
                                            <span className="strategy-name">CIVIL EVACUATION</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* PDF Download Button - MOVED TO HERE (BELOW MITIGATION OPTIONS) */}
                            {(simulationStatus === "IMPACT" || simulationStatus === "SUCCESS" || simulationStatus === "IMPACT_AFTER_EVAC" || simulationStatus === "EVACUATION_PENDING") && (
                                <button 
                                    className="download-pdf-btn" 
                                    onClick={generatePDFReport} 
                                    disabled={simulationStatus === "DEFLECTING" || simulationStatus === "EVACUATING"}
                                >
                                    <span className="icon">📄</span> EXPORT EMERGENCY BRIEFING
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Deflection Strategy Modal/Panel */}
            {showMitigationPanel && (
                <div className="mitigation-overlay" onClick={() => setShowMitigationPanel(false)}>
                    <div className="mitigation-panel" onClick={e => e.stopPropagation()}>
                        <div className="panel-header">CONFIGURE DEFLECTION STRATEGY</div>
                        <div className="strategy-buttons-modal">
                            {mitigationStrategies.map(strategy => (
                                <div
                                    key={strategy.id}
                                    className={`strategy-card ${deflectionStrategy === strategy.id ? 'active' : ''}`}
                                    onClick={() => setDeflectionStrategy(strategy.id)}
                                >
                                    <span className="strategy-icon">{strategy.icon}</span>
                                    <div className="strategy-name">{strategy.name}</div>
                                </div>
                            ))}
                        </div>
                        <div className="strategy-params">
                            <div className="slider-group">
                                <label className="input-label">Time Before Impact (days): {timeBeforeImpact}</label>
                                <input type="range" min="1" max="1000" value={timeBeforeImpact} onChange={e => setTimeBeforeImpact(e.target.value)} className="slider" />
                            </div>
                            <div className="slider-group">
                                <label className="input-label">Impactor Mass: {impactorMass} kg</label>
                                <input type="range" min="100" max="10000" value={impactorMass} onChange={e => setImpactorMass(e.target.value)} className="slider" />
                            </div>
                        </div>
                        <button className="confirm-btn" onClick={handleRunDeflection}>DEPLOY</button>
                        <button className="back-btn" onClick={() => setShowMitigationPanel(false)}>
                            <span className="icon">← Back</span>
                        </button>
                    </div>
                </div>
            )}
            
            {/* Detailed Evacuation Planning Panel */}
            {evacuationPlanData && <EvacuationPlanningPanel />}


            {/* Success/Failure Message */}
            {deflectionSuccess !== null && (
                <div className="result-overlay">
                    <div className={`result-box ${deflectionSuccess ? 'success' : 'failure'}`}>
                        <div className="result-header">{deflectionSuccess ? 'DEFENSE SUCCESS' : 'DEFENSE FAILED'}</div>
                        {!deflectionSuccess && (
                            <>
                                <div className="failed-strategies-header">
                                    <p>The attempted {mitigationStrategies.find(m => m.id === deflectionStrategy)?.name} failed. Proceed to evacuation planning.</p>
                                </div>
                            </>
                        )}
                        <div className="result-metrics">
                            <div className="metric-item">
                                <div className="metric-label">NEW RISK LEVEL:</div>
                                <div className="metric-value">{deflectionSuccess ? 'SAFE' : riskLevel}</div>
                            </div>
                        </div>
                        {deflectionSuccess ? (
                            <button className="close-btn" onClick={() => setDeflectionSuccess(null)}>Close</button>
                        ) : (
                            <button 
                                className="confirm-btn red-confirm" 
                                onClick={() => { 
                                    setDeflectionSuccess(null); 
                                    const plan = generateEvacuationPlan(targetLocation, predictedFatalities, timeBeforeImpact);
                                    setEvacuationPlanData(plan);
                                }}
                            >
                                PROCEED TO EVACUATION (Step 3)
                            </button>
                        )}
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default AsteroidSimulator;