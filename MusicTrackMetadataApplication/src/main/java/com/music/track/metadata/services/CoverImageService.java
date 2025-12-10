package com.music.track.metadata.services;

import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.JsonPathException;
import com.music.track.metadata.clients.MusicTrackClient;
import com.music.track.metadata.dto.CoverImageData;
import com.music.track.metadata.entities.CoverImage;
import com.music.track.metadata.repositories.CoverImageRepository;
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class CoverImageService {

    private MusicTrackClient musicTrackClient;
    private CoverImageRepository coverImageRepository;
    private final ModelMapper modelMapper;

    public CoverImageService(ModelMapper modelMapper, CoverImageRepository coverImageRepository, MusicTrackClient musicTrackClient) {
        this.modelMapper = modelMapper;
        this.coverImageRepository = coverImageRepository;
        this.musicTrackClient = musicTrackClient;
    }

    public CoverImageData getCoverImage(String albumId) {
        CoverImage coverImage = coverImageRepository.findByAlbumId(albumId);

        if (coverImage != null) {
            return modelMapper.map(coverImage, CoverImageData.class);
        } else {
            throw new EntityNotFoundException("The Cover Image entity was not found");
        }
    }

    public void verifyOrLoadCoverImage(String albumId, String apiToken) throws IllegalAccessException {
        boolean coverExists = coverImageRepository.existsByAlbumId(albumId);

        if (!coverExists) {
            retrieveCoverImageFromSource(albumId, apiToken)
                    .map(data -> CoverImage.builder()
                            .albumId(albumId)
                            .data(data)
                            .build())
                    .ifPresent(coverImage ->
                            coverImageRepository.save(coverImage)
                    );
        }
    }

    public Optional<String> retrieveCoverImageFromSource(String albumId, String apiToken) throws IllegalAccessException {
        String authorizationHeader = String.format("Bearer  %s", apiToken);

        try {
            ResponseEntity<String> response = musicTrackClient.searchAlbum(authorizationHeader,albumId);

            if (response != null && response.getStatusCode().is2xxSuccessful() && response.hasBody()){
                return Optional.ofNullable(processCoverImageResponseData(albumId, response.getBody()));
            }
        } catch(FeignException feignException) {
            log.error("Error while invoking external api", feignException);
            throw new IllegalAccessException("Not allowed to call external api.");
        }

        return Optional.empty();
    }

    private String processCoverImageResponseData(String albumId, String json) {
        try {
            return Optional.ofNullable(JsonPath.read(json, "$.images"))
                    .map(o -> (List<?>)o)
                    .map(list -> (Map<?, ?>)list.get(0))
                    .map(imageMap -> imageMap.get("url"))
                    .map(url -> {
                        try {
                            BufferedImage image = ImageIO.read(new URL(url.toString()));
                            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
                            ImageWriter writer = writers.next();


                            ByteArrayOutputStream baos = new ByteArrayOutputStream();
                            ImageOutputStream outputStream = ImageIO.createImageOutputStream(baos);
                            writer.setOutput(outputStream);

                            ImageWriteParam params = writer.getDefaultWriteParam();
                            params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                            params.setCompressionQuality(0.5f);

                            writer.write(null, new IIOImage(image, null, null), params);

                            outputStream.close();
                            writer.dispose();


                            //ImageIO.write(image, "jpg", baos);



                            return Base64.getEncoder().encodeToString(baos.toByteArray());
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }).orElse(null);
        } catch (JsonPathException je) {
            log.error("No cover image was found for {}", albumId, je);
        }

        return null;
    }
}
