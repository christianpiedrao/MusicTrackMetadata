package com.music.track.metadata.utils;

import com.music.track.metadata.dto.ResponseObject;
import com.music.track.metadata.enums.ResultType;
import org.springframework.http.ResponseEntity;

public class ResponseUtils {
    public static ResponseObject getResponseObject(Object data, ResultType resultType, String message) {
        return ResponseObject.builder()
                .data(data)
                .message(message)
                .resultType(resultType)
                .build();
    }

    public static ResponseEntity<ResponseObject> getInfoResponse(String message) {
        return getInfoResponse(null, message);
    }

    public static ResponseEntity<ResponseObject> getInfoResponse(Object data, String message) {
        return ResponseEntity.ok(getResponseObject(data, ResultType.INFO, message));
    }

    public static ResponseEntity<ResponseObject> getSuccessResponseObj(Object data) {
        return getSuccessResponse(data, null);
    }

    public static ResponseEntity<ResponseObject> getSuccessResponse(String message) {
        return getSuccessResponse(null, message);
    }

    public static ResponseEntity<ResponseObject> getSuccessResponse(Object data, String message) {
        return ResponseEntity.ok(getResponseObject(data, ResultType.SUCCESS, message));
    }

    public static ResponseEntity<ResponseObject> getErrorResponse(String message) {
        return getErrorResponse(null, message);
    }

    public static ResponseEntity<ResponseObject> getErrorResponse(Object data, String message) {
        return ResponseEntity.badRequest().body(getResponseObject(data, ResultType.ERROR, message));
    }

    public static ResponseEntity<ResponseObject> getSevereResponse(String message) {
        return getSevereResponse(null, message);
    }

    public static ResponseEntity<ResponseObject> getSevereResponse(Object data, String message) {
        return ResponseEntity.internalServerError().body(getResponseObject(data, ResultType.SEVERE, message));
    }
}
