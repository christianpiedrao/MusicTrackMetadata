package com.music.track.metadata.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MusicTrackData {
    private String isrc;
    private String name;
    private String artistName;
    private String albumName;
    private String albumId;
    private Boolean isExplicit;
    private Integer playbackSeconds;
}
