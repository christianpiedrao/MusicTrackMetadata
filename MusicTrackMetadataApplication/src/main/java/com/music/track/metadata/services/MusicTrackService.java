package com.music.track.metadata.services;

import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import com.music.track.metadata.clients.MusicTrackAuthClient;
import com.music.track.metadata.clients.MusicTrackClient;
import com.music.track.metadata.dto.CoverImageData;
import com.music.track.metadata.dto.MusicTrackData;
import com.music.track.metadata.entities.MusicTrack;
import com.music.track.metadata.repositories.MusicTrackRepository;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MusicTrackService {

    @Value("${spotify.api.clientId}")
    String clientId;

    @Value("${spotify.api.clientSecret}")
    String clientSecret;

    private final MusicTrackAuthClient musicTrackAuthClient;
    private final MusicTrackClient musicTrackClient;
    private final CoverImageService coverImageService;
    private final MusicTrackRepository musicTrackRepository;
    private final ModelMapper modelMapper;

    public MusicTrackService(MusicTrackAuthClient musicTrackAuthClient, MusicTrackClient musicTrackClient,
                             CoverImageService coverImageService, MusicTrackRepository musicTrackRepository,
                             ModelMapper modelMapper) {
        this.musicTrackAuthClient = musicTrackAuthClient;
        this.musicTrackClient = musicTrackClient;
        this.coverImageService = coverImageService;
        this.musicTrackRepository = musicTrackRepository;
        this.modelMapper = modelMapper;
    }

    public MusicTrackData getMusicTrack(String isrc) {
        MusicTrack musicTrack = musicTrackRepository.findByIsrc(isrc);

        if (musicTrack != null) {
            return modelMapper.map(musicTrack, MusicTrackData.class);
        } else {
            throw new EntityNotFoundException("The music track metadata was not found.");
        }
    }

    public CoverImageData getMusicTrackCover(String isrc) {
        MusicTrack musicTrack = musicTrackRepository.findByIsrc(isrc);

        if (musicTrack != null) {
            return coverImageService.getCoverImage(musicTrack.getAlbumId());
        } else {
            throw new EntityNotFoundException("The cover image for the music track was not found.");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public MusicTrackData createMusicTrack(String isrc) throws IllegalAccessException, IllegalArgumentException {
        String query = String.format("isrc:%s", isrc);

        try {
            if (musicTrackRepository.existsByIsrc(isrc)) {
                throw new IllegalArgumentException("The ISRC is already registered.");
            }

            String apiToken = getClientToken();
            String authorizationHeader = String.format("Bearer  %s", apiToken);
            ResponseEntity<String> response = musicTrackClient.searchTracks(authorizationHeader, query, "track");

            if (response != null && response.getStatusCode().is2xxSuccessful() && response.hasBody()){
                MusicTrackData musicTrackData = processMusicTrackResponseData(isrc, response.getBody());
                MusicTrack musicTrack = modelMapper.map(musicTrackData, MusicTrack.class);
                musicTrackRepository.save(musicTrack);
                coverImageService.verifyOrLoadCoverImage(musicTrackData.getAlbumId(), apiToken);

                return musicTrackData;
            }
        } catch (FeignException feignException) {
            log.error("Error while invoking external api", feignException);
            throw new IllegalAccessException("Not allowed to call external api.");
        }

        throw new IllegalArgumentException("The Music Track metadata was not found");
    }

    private String getClientToken() throws IllegalAccessException {
        if (StringUtils.isNotBlank(clientId) && StringUtils.isNotBlank(clientSecret)) {
            String auth = Base64.getEncoder().encodeToString((clientId +
                    ":" + clientSecret).getBytes());
            String authorizationHeader = String.format("Basic %s", auth);
            ResponseEntity<String> response = musicTrackAuthClient.getToken(authorizationHeader, Map.of("grant_type", "client_credentials"));
            if (response != null && response.getStatusCode().is2xxSuccessful() && response.hasBody()){
                return JsonPath.read(response.getBody(), "$.access_token");
            }
        }

        throw new IllegalAccessException("Not allowed to call external api.");
    }

    private MusicTrackData processMusicTrackResponseData(String isrc, String json) {
        try {
            String name = JsonPath.read(json, "$.tracks.items[0].name");
            Boolean isExplicit = JsonPath.read(json, "$.tracks.items[0].explicit");
            String albumId = JsonPath.read(json, "$.tracks.items[0].album.id");
            String albumName = JsonPath.read(json, "$.tracks.items[0].album.name");

            Integer playbackSeconds = Optional.ofNullable(JsonPath.read(json, "$.tracks.items[0].duration_ms"))
                    .map(o -> ((Integer)o) / 1000)
                    .orElse(null);

            String artistName = Optional.ofNullable(JsonPath.read(json, "$.tracks.items[0].artists"))
                    .map(o -> (List<?>)o)
                    .map(list -> list.stream()
                            .map(artistItem -> (Map<?, ?>) artistItem)
                            .map(artistMap -> artistMap.get("name").toString())
                            .collect(Collectors.joining(", ")))
                    .orElse("");

            return new MusicTrackData(isrc, name, artistName, albumName, albumId, isExplicit, playbackSeconds);
        } catch (PathNotFoundException pe) {
            throw new IllegalArgumentException("The Music Track metadata was not found");
        }
    }
}
