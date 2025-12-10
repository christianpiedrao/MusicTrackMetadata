package com.music.track.metadata.controllers;

import com.music.track.metadata.dto.ResponseObject;
import com.music.track.metadata.dto.UserData;
import com.music.track.metadata.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.music.track.metadata.utils.ResponseUtils.getErrorResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSevereResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSuccessResponse;
import static com.music.track.metadata.utils.ResponseUtils.getSuccessResponseObj;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
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
    @Operation(summary = "The method allows to create a new user")
    public ResponseEntity<ResponseObject> register(@RequestBody UserData userData) {
        try {
            userService.createUser(userData);
            return getSuccessResponse("User created successfully.");
        } catch(IllegalArgumentException ie) {
            return getErrorResponse(ie.getLocalizedMessage());
        } catch (Exception e) {
            log.error("Error while creating User username:{}", userData.getUsername(), e);
            return getSevereResponse(e.getLocalizedMessage());
        }
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/getUser/{username}")
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
    @Operation(summary = "The method allows to obtain the user information. Basic authentication is required.")
    public ResponseEntity<ResponseObject> getUser(@PathVariable String username){
        try {
            UserData userData = userService.getUser(username);
            return getSuccessResponseObj(userData);
        } catch(UsernameNotFoundException ue) {
            return getErrorResponse(ue.getLocalizedMessage());
        } catch (Exception e) {
            log.error("Error while retrieving User username:{}", username, e);
            return getSevereResponse(e.getLocalizedMessage());
        }
    }
}
