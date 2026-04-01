import { SUB_AREAS } from '../constants';

function SearchForm({
  area,
  setArea,
  areas,
  subArea,
  setSubArea,
  bloodGroup,
  setBloodGroup,
  bloodGroups,
  handleFindDonors,
  loading
}) {
  
  // When city changes, reset sub-area to "All"
  const handleCityChange = (e) => {
    setArea(e.target.value);
    setSubArea('All');
  };

  // Get current sub-areas based on selected city
  const currentSubAreas = SUB_AREAS[area] || ['All'];

  return (
    <div className="search-section" aria-label="Search Settings">
      <div className="form-group">
        <label htmlFor="area-select">City</label>
        <select
          id="area-select"
          value={area}
          onChange={handleCityChange}
        >
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="sub-area-select">Sub-area</label>
        <select
          id="sub-area-select"
          value={subArea}
          onChange={(e) => setSubArea(e.target.value)}
        >
          {currentSubAreas.map((sa) => (
            <option key={sa} value={sa}>
              {sa}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="blood-select">Blood Group</label>
        <select
          id="blood-select"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group" style={{ flex: '0.6' }}>
        <button
          className="primary"
          onClick={handleFindDonors}
          disabled={loading}
          aria-label="Search Donors"
          style={{ width: '100%' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
