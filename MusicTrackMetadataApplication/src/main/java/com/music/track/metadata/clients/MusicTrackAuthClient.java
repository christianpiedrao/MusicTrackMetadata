package com.music.track.metadata.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@FeignClient(name = "musicTrackAuthClient", url = "https://accounts.spotify.com/api/")
public interface MusicTrackAuthClient {

    @RequestMapping(method = RequestMethod.POST, value = "token/", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    ResponseEntity<String> getToken(@RequestHeader(name = "Authorization") String authorizationHeader,
                                    @RequestBody Map params);
}
