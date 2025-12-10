package com.music.track.metadata.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "musicTrackClient", url = "https://api.spotify.com/v1/")
public interface MusicTrackClient {

    @RequestMapping(method = RequestMethod.GET, value = "search")
    ResponseEntity<String> searchTracks(@RequestHeader(name = "Authorization") String authorizationHeader,
                                     @RequestParam(name = "q") String query, @RequestParam(name = "type") String type);

    @RequestMapping(method = RequestMethod.GET, value = "albums/{albumId}")
    ResponseEntity<String> searchAlbum(@RequestHeader(name = "Authorization") String authorizationHeader,
                                       @PathVariable String albumId);
}
