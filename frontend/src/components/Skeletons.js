import { memo } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";


function MovieCardSkeletonComponent() {
  return (
    <Box
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        bgcolor: "background.paper",
        maxWidth: 320,
        width: "100%",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={380}
        animation="wave"
        sx={{ bgcolor: "action.hover" }}
      />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="70%" height={28} animation="wave" />
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          <Skeleton variant="rounded" width={80} height={24} animation="wave" />
        </Box>
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          sx={{ mt: 1.5 }}
          animation="wave"
        />
        <Skeleton variant="text" width="85%" height={20} animation="wave" />
      </Box>
    </Box>
  );
}

export const MovieCardSkeleton = memo(MovieCardSkeletonComponent);

export function MovieGridSkeleton({ count = 8 }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 3,
        p: 3,
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </Box>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Skeleton
        variant="rectangular"
        height={500}
        sx={{ borderRadius: 2, mb: 3, bgcolor: "action.hover" }}
        animation="wave"
      />
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Skeleton
          variant="rectangular"
          width={300}
          height={450}
          sx={{ borderRadius: 2, flexShrink: 0 }}
          animation="wave"
        />
        <Box sx={{ flex: 1, minWidth: 280 }}>
          <Skeleton variant="text" width="60%" height={48} animation="wave" />
          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <Skeleton
              variant="rounded"
              width={80}
              height={32}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={32}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={60}
              height={32}
              animation="wave"
            />
          </Box>
          <Skeleton variant="text" width="100%" height={24} animation="wave" />
          <Skeleton variant="text" width="100%" height={24} animation="wave" />
          <Skeleton variant="text" width="75%" height={24} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
}

export function HeroSkeleton() {
  return (
    <Box
      sx={{
        height: { xs: 400, md: 550 },
        position: "relative",
        bgcolor: "action.hover",
      }}
    >
      <Box sx={{ position: "absolute", bottom: 60, left: 40, maxWidth: 600 }}>
        <Skeleton variant="text" width={400} height={60} animation="wave" />
        <Skeleton
          variant="text"
          width={300}
          height={30}
          sx={{ mt: 1 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="100%"
          height={24}
          sx={{ mt: 2 }}
          animation="wave"
        />
        <Skeleton variant="text" width="85%" height={24} animation="wave" />
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Skeleton
            variant="rounded"
            width={140}
            height={48}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            width={140}
            height={48}
            animation="wave"
          />
        </Box>
      </Box>
    </Box>
  );
}
