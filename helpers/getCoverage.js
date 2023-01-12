const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');

/**
 * Get INSTRUCTION coverage from jacoco report.
 *
 * @param {string} coveragePath
 * @returns {number}
 */
function getCoverage(coveragePath) {
    if ( ! fs.existsSync(coveragePath) ){
        return 0.0;
    }
    var xml = fs.readFileSync(coveragePath, 'utf-8');
    var doc = new dom().parseFromString(xml)
    let node = xpath.select("//report/counter[@type='INSTRUCTION']", doc)[0];
    let missed = parseInt(node.getAttribute('missed'));
    let covered = parseInt(node.getAttribute('covered'));
    return Math.round(1000.0 * covered / (missed + covered)) / 10.0;
}

module.exports = getCoverage;


