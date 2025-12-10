package com.music.track.metadata.dto;

import com.music.track.metadata.enums.ResultType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseObject {
    private Object data;
    private ResultType resultType;
    private String message;
}
