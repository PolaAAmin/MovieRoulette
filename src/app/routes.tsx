import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import HomePage from "@components/home/HomePage";
import { MovieCardSkeletonGrid, MovieTileSkeletonGrid, DetailsSkeleton, RandomResultSkeleton } from "@/components/ui/Skeletons";
import Spinner from "@/components/ui/Spinner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Lazy load components to avoid circular dependencies
const MovieListPage = lazy(() =>
  import("@features/movies").then(module => ({
    default: module.MovieListPage
  }))
);

const RandomPage = lazy(() =>
  import("@features/random").then(module => ({
    default: module.RandomPage
  }))
);

const FavouritesPage = lazy(() =>
  import("@features/favourites").then(module => ({
    default: module.FavouritesPage
  }))
);

const AboutPage = lazy(() =>
  import("@features/about").then(module => ({
    default: module.AboutPage
  }))
);

const SignInPage = lazy(() =>
  import("@features/auth").then(module => ({
    default: module.SignInPage
  }))
);

const SignUpPage = lazy(() =>
  import("@features/auth").then(module => ({
    default: module.SignUpPage
  }))
);

const ProfilePage = lazy(() =>
  import("@components/profile/ProfilePage")
);

const MovieDetailsPage = lazy(() =>
  import("@components/movie/MovieDetailsPage")
);

// Wrapper to extract route param and pass as prop to MovieDetailsPage
const MovieDetailsWrapper = () => {
  const { id } = useParams();
  return <MovieDetailsPage movieId={Number(id)} />;
};

export const appRoutes = () => (
  <ErrorBoundary fallback={<div>Something went wrong.</div>}>
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<RandomResultSkeleton />}>
          <HomePage />
        </Suspense>
      } />
      <Route
        path="/movies"
        element={
          <Suspense fallback={<MovieTileSkeletonGrid count={6} />}>
            <MovieListPage mediaType="movie" />
          </Suspense>
        }
      />
      <Route
        path="/series"
        element={
          <Suspense fallback={<MovieTileSkeletonGrid count={6} />}>
            <MovieListPage mediaType="series" />
          </Suspense>
        }
      />
      <Route
        path="/random"
        element={
          <Suspense fallback={<RandomResultSkeleton />}>
            <RandomPage />
          </Suspense>
        }
      />
      <Route
        path="/favourites"
        element={
          <Suspense fallback={<MovieCardSkeletonGrid count={4} />}>
            <FavouritesPage />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<Spinner/>}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="/signin"
        element={
          <Suspense fallback={<Spinner/>}>
            <SignInPage />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<Spinner/>}>
            <SignUpPage />
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<Spinner/>}>
            <ProfilePage />
          </Suspense>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <Suspense fallback={<DetailsSkeleton />}>
            <MovieDetailsWrapper />
          </Suspense>
        }
      />
    </Routes>
  </ErrorBoundary>
);