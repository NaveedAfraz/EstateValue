const { BENGALURU_LOCATIONS } = require('../frontend/src/data/locations');

function testFilter(query) {
    console.log(`\nTesting query: "${query}"`);
    const filtered = BENGALURU_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    
    if (filtered.length > 0) {
        console.log(`✅ Found ${filtered.length} matches:`);
        filtered.forEach(f => console.log(`  - ${f}`));
    } else {
        console.log(`⚠️ No matches found.`);
    }
    return filtered;
}

console.log('--- Testing Autocomplete Logic ---');

// Test match case
const match = testFilter('Indira');
if (!match.some(m => m.trim() === 'indira nagar')) {
    console.error('❌ FAILED: "indira nagar" should be in results for "Indira"');
    process.exit(1);
}

// Test no-match case
const noMatch = testFilter('Mumbai');
if (noMatch.length !== 0) {
    console.error('❌ FAILED: "Mumbai" should have 0 results');
    process.exit(1);
}

console.log('\n🎉 AUTOCOMPLETE LOGIC VERIFIED!');
