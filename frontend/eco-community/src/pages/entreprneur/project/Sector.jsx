import React from 'react';

// Mapping of backend sector values to French display labels
const sectorTranslations = {
    'agriculture': 'Agriculture',
    'technology': 'Technologie',
    'crafts': 'Artisanat',
    'commerce': 'Commerce',
    'education': 'Éducation',
    'healthcare': 'Santé',
    'tourism': 'Tourisme',
    'manufacturing': 'Industrie',
    'services': 'Services'
};

// Component to display sector in French
const SectorDisplay = ({ sector }) => {
    const frenchSector = sectorTranslations[sector.toLowerCase()] || sector;

    return (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
      {frenchSector}
    </span>
    );
};

export default SectorDisplay;