package com.music.track.metadata.repositories;

import com.music.track.metadata.entities.CoverImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoverImageRepository extends JpaRepository<CoverImage, Long> {
    boolean existsByAlbumId(String albumId);
    CoverImage findByAlbumId(String albumId);
}
