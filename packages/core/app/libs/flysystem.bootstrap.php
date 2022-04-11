<?php
// The internal adapter
$adapter = new League\Flysystem\Local\LocalFilesystemAdapter(
  // Determine root directory
  PROM_UPLOADS_ROOT,
);

// The FilesystemOperator
$filesystem = new League\Flysystem\Filesystem($adapter);

// The internal adapter
$localesAdapter = new League\Flysystem\Local\LocalFilesystemAdapter(
  // Determine root directory
  PROM_LOCALES_ROOT,
);

// The FilesystemOperator
$localesFilesystem = new League\Flysystem\Filesystem($localesAdapter);