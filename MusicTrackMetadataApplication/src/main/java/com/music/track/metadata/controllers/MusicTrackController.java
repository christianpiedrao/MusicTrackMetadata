package com.music.track.metadata.controllers;

import com.music.track.metadata.dto.CoverImageData;
import com.music.track.metadata.dto.MusicTrackData;
import com.music.track.metadata.dto.ResponseObject;
import com.music.track.metadata.services.MusicTrackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.music.track.metadata.utils.ResponseUtils.getErrorResponse;
import static com.music.track.metadata.utils.ResponseUtils.getInfoResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSevereResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSuccessResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSuccessResponseObj;

@RestController
@RequestMapping("/musictrack")
@Slf4j
public class MusicTrackController {

    private final MusicTrackService musicTrackService;

    public MusicTrackController(MusicTrackService musicTrackService) {
        this.musicTrackService = musicTrackService;
    }

    @PreAuthorize("hasAuthority('ALL') or hasAuthority('WRITE')")
    @GetMapping("/create/{isrc}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The result of the operation is successful",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "400", description = "There is a controlled error while processing the request",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "500", description = "An unexpected and uncontrolled error occurred",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }) })
    @Operation(summary = "The method allows to create a music track metadata record in base of the isrc code passed as part " +
            "of the path. Basic authentication is required and the permissions ALL or WRITE.")
    public ResponseEntity<ResponseObject> createMusicTrack(@PathVariable String isrc) {
        try {
            MusicTrackData result = musicTrackService.createMusicTrack(isrc);
            return getSuccessResponse(result, "Music Track created.");
        } catch (IllegalArgumentException ie){
            return getErrorResponse(ie.getLocalizedMessage());
        } catch (Exception e) {
            log.error("Error while creating Music Track isrc:{}", isrc, e);
            return getSevereResponse(e.getLocalizedMessage());
        }
    }

    @PreAuthorize("hasAuthority('ALL') or hasAuthority('READ')")
    @GetMapping("/getMetadata/{isrc}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The result of the operation is successful",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "400", description = "There is a controlled error while processing the request",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "500", description = "An unexpected and uncontrolled error occurred",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }) })
    @Operation(summary = "The method allows to obtain the music track metadata record in base of the isrc code passed as " +
            "part of the path. Basic authentication is required and the permissions ALL or READ.")
    public ResponseEntity<ResponseObject> getMusicTrack(@PathVariable String isrc) {
        try {
            MusicTrackData musicTrackData = musicTrackService.getMusicTrack(isrc);
            return getSuccessResponse(musicTrackData, null);
        } catch(EntityNotFoundException ex) {
            return getInfoResponse(ex.getLocalizedMessage());
        } catch (Exception e) {
            log.error("Error while retrieving Music Track isrc:{}", isrc, e);
            return getSevereResponse(e.getLocalizedMessage());
        }
    }

    @PreAuthorize("hasAuthority('ALL') or hasAuthority('READ')")
    @GetMapping("/getCover/{isrc}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The result of the operation is successful",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "400", description = "There is a controlled error while processing the request",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }),
            @ApiResponse(responseCode = "500", description = "An unexpected and uncontrolled error occurred",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResponseObject.class)) }) })
    @Operation(summary = "The method allows to obtain the  cover of a music track in base of the isrc code passed as " +
            "part of the path. Basic authentication is required and the permissions ALL or READ.")
    public ResponseEntity<ResponseObject> getCoverImage(@PathVariable String isrc) {
        try {
            CoverImageData coverImageData = musicTrackService.getMusicTrackCover(isrc);
            return getSuccessResponseObj(coverImageData.getData());
        } catch(EntityNotFoundException ex) {
            return getInfoResponse(ex.getLocalizedMessage());
        }  catch (Exception e) {
            log.error("Error while retrieving Music Track Cover isrc:{}", isrc, e);
            return getSevereResponse(e.getLocalizedMessage());
        }
    }
}
