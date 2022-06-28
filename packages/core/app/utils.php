<?php
/**
 * DO NOT DELETE OR EDIT THIS FILE.
 * THIS FILE IS PART OF COCKPIT CMS
 * AND ANY MODIFICATION MAY BREAK OR BE
 * OVERRIDDEN IN NEXT UPDATE.
 *
 */
use Psr\Http\Message\ResponseInterface;

include_once __DIR__ . '/libs/env.bootstrap.php';

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

class Utils
{
  /**
   * Imports all php scripts for specified folder
   * @return string[] Returns an array of imported paths
   */
  public function autoloadFolder(string $pathToFolder)
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
   * Autoloads models for specified module root. This is primarily used by modules.
   * @return string[]|false An array of module names or
   */
  public function autoloadModels(string $moduleRoot)
  {
    global $PROM_OPINIONATED_SETTINGS;
    $folderName = $PROM_OPINIONATED_SETTINGS->modules['modelsFolderName'];

    // Save previously declared classes in memory
    $classes = get_declared_classes();

    // Autoload files and save imported filepaths to an array
    $importedFilepaths = $this->autoloadFolder("$moduleRoot/$folderName");

    if (!$importedFilepaths) {
      return false;
    }

    // Should have all of loaded model names in array
    $diff = array_values(array_diff(get_declared_classes(), $classes));

    return $diff;
  }

  public function autoloadControllers(string $moduleRoot)
  {
    global $PROM_OPINIONATED_SETTINGS;

    $folderName = $PROM_OPINIONATED_SETTINGS->modules['controllersFolderName'];

    $importedFilepaths = $this->autoloadFolder("$moduleRoot/$folderName");
    if (!$importedFilepaths) {
      return false;
    }

    return array_map(function (string $filePath) {
      $baseName = basename($filePath, '.controller.php');
      return $baseName;
    }, $importedFilepaths);
  }
}

class BootstrapUtils
{
  public static function getModuleRoot(string $moduleName)
  {
    return PROM_ROOT_FOLDER . "/modules/$moduleName";
  }

  public static function getValidModuleNames()
  {
    return array_merge(
      ['Core'],
      // Filter out the 'Core' module from basic set
      array_filter(
        // Map that dirs to folder names
        array_map(
          function ($dir) {
            return basename($dir);
          },
          // Firstly get all the dirs from modules folder
          glob(PROM_ROOT_FOLDER . '/modules/*', GLOB_ONLYDIR),
        ),
        function ($moduleName) {
          $moduleRoot = BootstrapUtils::getModuleRoot($moduleName);

          if (!file_exists("$moduleRoot/module-info.json")) {
            echo "<b>Warning </b> - Created module '$moduleName' wont be functional if you don't provide module-info.json";
            return false;
          }

          return $moduleName !== 'Core';
        },
      ),
    );
  }
}

function prepareJsonResponse(
  ResponseInterface $response,
  array $data,
  string $message = '',
  $code = false
) {
  return $response->getBody()->write(
    json_encode([
      'data' => $data,
      'message' => $message,
      'code' => $code,
    ]),
  );
}

function handleDuplicateEntriesError($response, $exception)
{
  $errorText = str_replace(
    ['UNIQUE constraint failed: ', ' '],
    '',
    $exception->errorInfo[2],
  );

  prepareJsonResponse(
    $response,
    array_map(function ($item) {
      return strpos($item, '.') !== false
        ? explode('.', $item)[1]
        : explode('_', $item)[1];
    }, explode(',', $errorText)),
    'Duplicate entries',
    intval($exception->getCode()),
  );
}

function verifyPostInput()
{
}

function verifyQueryInput()
{
}

function str_includes($haystack, $needle)
{
  return strpos($haystack, $needle) !== false;
}

/**
 * Takes string and normalizes to array which is ready to eloquent model where
 *
 * Accepts string: some_field,some_manipulator,value;some_field,some_manipulator,value;...
 */
function normalizeWhereQueryParam(string $filterParam)
{
  $whereQuery = [];
  $whereInQuery = [];
  $PART_SEPARATOR = ';';
  $PIECE_SEPARATOR = '.';
  $stringToExtract = $filterParam;

  // If there is an array instead of string, happens when it was defined like this in url
  if (is_array($filterParam)) {
    $stringToExtract = implode($PART_SEPARATOR, $filterParam);
  }

  // Split by separator and attach each process
  foreach (explode($PART_SEPARATOR, $stringToExtract) as $part) {
    $pieces = explode($PIECE_SEPARATOR, $part);

    if (isset($pieces[0]) && isset($pieces[1]) && isset($pieces[2])) {
      if ($pieces[1] === 'IN') {
        $whereInQuery[] = [$pieces[0], json_decode("[$pieces[2]]")];
      } else {
        $whereQuery[] = [
          $pieces[0],
          $pieces[1],
          str_replace('/', '\/', $pieces[2]),
        ];
      }
    }
  }

  return [$whereQuery, $whereInQuery];
}
