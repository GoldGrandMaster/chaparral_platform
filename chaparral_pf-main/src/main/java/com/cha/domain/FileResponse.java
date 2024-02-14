package com.cha.domain;

public record FileResponse(String name, String uploadId, String path, String type, String eTag) {}
