package com.music.track.metadata;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MusicTrackMetadataApplication {

	public static void main(String[] args) {
		SpringApplication.run(MusicTrackMetadataApplication.class, args);
	}
}
