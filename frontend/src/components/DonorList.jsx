import { useState, useEffect } from 'react';
import DonorCard from './DonorCard';

const DonorList = ({ donors, loading, area, hasSearched, onAction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Reset to page 1 whenever results change
  useEffect(() => {
    setCurrentPage(1);
  }, [donors, area]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (hasSearched && donors.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-message">No donors found in {area}.</p>
        <p className="empty-hint">Try adjusting your blood group or area filters.</p>
      </div>
    );
  }

  // Pagination Logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentDonors = donors.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(donors.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to results top
    window.scrollTo({ top: document.getElementById('search-start')?.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <div className="results-container">
      {hasSearched && (
        <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="page-title" style={{ fontSize: '24px' }}>Available Donors</h2>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, donors.length)} of {donors.length} results
          </span>
        </div>
      )}

      <ul className="donor-grid">
        {currentDonors.map((donor) => (
          <DonorCard 
            key={donor._id} 
            donor={donor} 
            onAction={onAction}
          />
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="page-btn page-label-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i + 1} 
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            className="page-btn page-label-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorList;
