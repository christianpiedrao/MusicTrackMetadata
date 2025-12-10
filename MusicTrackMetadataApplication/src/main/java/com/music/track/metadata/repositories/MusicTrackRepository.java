package com.music.track.metadata.repositories;

import com.music.track.metadata.entities.MusicTrack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicTrackRepository extends JpaRepository<MusicTrack, Long> {
    MusicTrack findByIsrc(String isrc);
    boolean existsByIsrc(String isrc);
}
