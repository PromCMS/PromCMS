<?php

define('PHP_VERSION_MAJOR', explode('.', phpversion())[0]);

if (PHP_VERSION_MAJOR <= 7) {
  /**
   * If current haystack includes needle.
   * Polyfil of php8 str_includes
   */
  function str_includes($haystack, $needle)
  {
    return strpos($haystack, $needle) !== false;
  }
}

/**
 * Get content of defined directory
 */
function getDirContents($dir, &$results = [])
{
  $files = scandir($dir);

  foreach ($files as $key => $value) {
    $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
    if (!is_dir($path)) {
      $results[] = $path;
    } elseif ($value != '.' && $value != '..') {
      getDirContents($path, $results);
      $results[] = $path;
    }
  }

  return $results;
}

/**
 * Imports all php scripts for specified folder
 * @return string[] Returns an array of imported paths
 */
function autoloadFolder(string $pathToFolder)
{
  $importedFilePaths = [];
  if (!is_dir($pathToFolder)) {
    return false;
  }

  $filePaths = getDirContents($pathToFolder);
  foreach ($filePaths as $filePath) {
    include_once $filePath;
    $importedFilePaths[] = $filePath;
  }

  return $importedFilePaths;
}

/**
 * Joins path by systems directory separator
 */
function joinPath(...$inp)
{
  return implode(DIRECTORY_SEPARATOR, $inp);
}

// Define folder to autoload - these folders contains classes
$foldersToAutoload = ['Errors', 'Concerns', 'Database', 'Misc'];

// Loop over defined folders and load them
foreach ($foldersToAutoload as $folderName) {
  autoloadFolder(joinPath(__DIR__, $folderName));
}
