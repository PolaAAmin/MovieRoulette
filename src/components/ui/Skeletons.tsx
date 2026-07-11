export function MovieCardSkeleton() {
  return (
    <div className="movie-card glass-panel" aria-hidden="true">
      <div className="skeleton-shine" style={{ aspectRatio: "3 / 4", borderRadius: "var(--radius-md)" }} />
      <div className="movie-badges mt-2">
        <div className="skeleton-shine" style={{ width: 60, height: 22, borderRadius: 6 }} />
        <div className="skeleton-shine" style={{ width: 40, height: 22, borderRadius: 6 }} />
      </div>
      <div className="skeleton-shine mt-2" style={{ width: "80%", height: 16, borderRadius: 4 }} />
      <div className="d-flex justify-content-between mt-2">
        <div className="skeleton-shine" style={{ width: 40, height: 12, borderRadius: 4 }} />
        <div className="skeleton-shine" style={{ width: 30, height: 12, borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function MovieCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="movies-rail">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieTileSkeleton() {
  return (
    <div className="movie-tile glass-panel" aria-hidden="true">
      <div className="skeleton-shine" style={{ width: 160, height: 240, borderRadius: "var(--radius-md)" }} />
      <div>
        <div className="movie-badges">
          <div className="skeleton-shine" style={{ width: 60, height: 22, borderRadius: 6 }} />
          <div className="skeleton-shine" style={{ width: 40, height: 22, borderRadius: 6 }} />
        </div>
        <div className="skeleton-shine mt-3" style={{ width: "70%", height: 18, borderRadius: 4 }} />
        <div className="skeleton-shine mt-2" style={{ width: "100%", height: 14, borderRadius: 4 }} />
        <div className="skeleton-shine mt-1" style={{ width: "90%", height: 14, borderRadius: 4 }} />
        <div className="movie-facts mt-3">
          <div className="skeleton-shine" style={{ width: 50, height: 20, borderRadius: 999 }} />
          <div className="skeleton-shine" style={{ width: 50, height: 20, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

export function MovieTileSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => (
        <MovieTileSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="details-page" aria-hidden="true">
      <div className="details-hero" style={{ minHeight: "60vh", background: "var(--color-bg-panel)" }}>
        <div className="container details-content">
          <div className="skeleton-shine" style={{ width: 200, height: 24, borderRadius: 999 }} />
          <div className="skeleton-shine mt-3" style={{ width: "60%", height: 56, borderRadius: 8 }} />
          <div className="skeleton-shine mt-3" style={{ width: "50%", height: 16, borderRadius: 4 }} />
          <div className="skeleton-shine mt-4" style={{ width: 140, height: 44, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

export function RandomResultSkeleton() {
  return (
    <div className="d-flex flex-column" aria-hidden="true">
      <div className="skeleton-shine" style={{ aspectRatio: "16 / 9", borderRadius: 18 }} />
      <div className="resubmit-row">
        <div className="skeleton-shine" style={{ width: 60, height: 60, borderRadius: "50%" }} />
        <div className="skeleton-shine" style={{ width: 90, height: 90, borderRadius: "50%" }} />
        <div className="skeleton-shine" style={{ width: 60, height: 60, borderRadius: "50%" }} />
      </div>
    </div>
  );
}
